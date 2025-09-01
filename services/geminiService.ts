/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Module-level variable to hold the initialized fal client instance.
// We use `any` as we're dynamically importing the type.
let falClient: any = null;

/**
 * Dynamically imports and initializes the Fal AI client on first use.
 * This avoids a crash on load if `process.env` is not defined in the browser.
 * @returns {Promise<any>} The initialized fal client instance.
 */
const getFalClient = async () => {
    if (!falClient) {
        // Dynamically import the fal client library.
        const { fal } = await import('@fal-ai/client');
        // Configure it with credentials from environment variables.
        fal.config({
            credentials: process.env.FAL_KEY,
        });
        falClient = fal;
    }
    return falClient;
};

// Helper for Fal AI image editing fallback
const falImageEditFallback = async (prompt: string, images: File[], context: string): Promise<string> => {
    try {
        const fal = await getFalClient();
        console.log(`Calling Fal AI for ${context} with prompt: ${prompt}`);
        // The fal client can take File objects directly and will handle uploads.
        const result: { images: { url: string }[] } = await fal.subscribe("fal-ai/nano-banana/edit", {
            input: {
                prompt: prompt,
                image_urls: images,
                output_format: "png",
                sync_mode: true, // This makes the URL a data URI
                num_images: 1,
            },
        });
        
        if (!result.images || result.images.length === 0) {
            throw new Error("Fal AI fallback did not return an image.");
        }
        
        console.log(`Fal AI fallback for ${context} successful.`);
        return result.images[0].url;

    } catch (falError) {
        console.error(`Fal AI fallback request for ${context} failed.`, falError);
        // Re-throw to be caught by the calling function's outer catch block.
        throw falError;
    }
};

// Helper for Fal AI text-to-image fallback
const falTextToImageFallback = async (userPrompt: string): Promise<string> => {
    try {
        const fal = await getFalClient();
        console.log(`Calling Fal AI for text-to-image fallback with prompt: ${userPrompt}`);
        const result: { images: { url: string }[] } = await fal.subscribe("fal-ai/nano-banana", {
            input: {
                prompt: userPrompt,
                output_format: "png",
                sync_mode: true,
                num_images: 1,
            },
        });

        if (!result.images || result.images.length === 0) {
            throw new Error("Fal AI fallback did not return an image.");
        }
        console.log("Fal AI text-to-image fallback successful.");
        return result.images[0].url; // This will be a data URI
    } catch (falError) {
        console.error(`Fal AI text-to-image fallback request failed.`, falError);
        throw falError;
    }
};


// Helper function to get image dimensions from a File object
const getImageDimensions = (file: File): Promise<{ width: number; height: number; }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = () => reject(new Error('Could not load image to get dimensions.'));
            if (e.target?.result) {
                img.src = e.target.result as string;
            } else {
                reject(new Error('FileReader did not produce a result.'));
            }
        };
        reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
        reader.readAsDataURL(file);
    });
};

// Helper function to convert a File object to a Gemini API Part
const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    
    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
};

const handleApiResponse = (
    response: GenerateContentResponse,
    context: string // e.g., "edit", "filter", "adjustment"
): string => {
    // 1. Check for prompt blocking first
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }

    // 2. Try to find the image part
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        console.log(`Received image data (${mimeType}) for ${context}`);
        return `data:${mimeType};base64,${data}`;
    }

    // 3. If no image, check for other reasons
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Image generation for ${context} stopped unexpectedly. Reason: ${finishReason}. This often relates to safety settings.`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }
    
    const textFeedback = response.text?.trim();
    const errorMessage = `The AI model did not return an image for the ${context}. ` + 
        (textFeedback 
            ? `The model responded with text: "${textFeedback}"`
            : "This can happen due to safety filters or if the request is too complex. Please try rephrasing your prompt to be more direct.");

    console.error(`Model response did not contain an image part for ${context}.`, { response });
    throw new Error(errorMessage);
};

/**
 * Generates an image from a text prompt.
 * @param userPrompt The text prompt describing the desired image.
 * @returns A promise that resolves to the data URL of the generated image.
 */
export const generateImageFromText = async (userPrompt: string): Promise<string> => {
    console.log(`Starting text-to-image generation: ${userPrompt}`);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: userPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png', // Using PNG is better for generated assets
            },
        });

        console.log('Received response from model for text-to-image.', response);
        
        if (!response.generatedImages || response.generatedImages.length === 0) {
            const errorMessage = `Image generation failed. The model did not return an image. This can happen due to safety filters or an issue with the prompt.`;
            console.error(errorMessage, { response });
            throw new Error(errorMessage);
        }
        
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (googleError) {
        console.warn(`Google API (generateImages) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            return await falTextToImageFallback(userPrompt);
        } catch (falError) {
            console.error(`Fal AI text-to-image fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI image generation failed with both primary and fallback services.');
        }
    }
};


/**
 * Generates an edited image using generative AI based on a text prompt and a specific point.
 * @param originalImage The original image file.
 * @param userPrompt The text prompt describing the desired edit.
 * @param hotspot The {x, y} coordinates on the image to focus the edit.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number }
): Promise<string> => {
    try {
        console.log('Starting generative edit at:', hotspot);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const originalImagePart = await fileToPart(originalImage);
        const prompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${userPrompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).

Editing Guidelines:
- The edit must be realistic and blend seamlessly with the surrounding area.
- The rest of the image (outside the immediate edit area) must remain identical to the original.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final edited image. Do not return text.`;
        const textPart = { text: prompt };

        console.log('Sending image and prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [originalImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model.', response);

        return handleApiResponse(response, 'edit');
    } catch (googleError) {
        console.warn(`Google API (edit) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            // Note: hotspot info is lost in fallback. The prompt is just the user's text.
            return await falImageEditFallback(userPrompt, [originalImage], 'edit');
        } catch (falError) {
            console.error(`Fal AI edit fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI edit operation failed with both primary and fallback services.');
        }
    }
};

/**
 * Generates an image with a filter or adjustment applied using generative AI.
 * @param originalImage The original image file.
 * @param stylizePrompt The text prompt describing the desired style.
 * @returns A promise that resolves to the data URL of the stylized image.
 */
export const generateStylizedImage = async (
    originalImage: File,
    stylizePrompt: string,
): Promise<string> => {
    try {
        console.log(`Starting style generation: ${stylizePrompt}`);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const originalImagePart = await fileToPart(originalImage);
        const prompt = `You are an expert photo editor AI. Your task is to apply a stylistic filter or a global adjustment to the entire image based on the user's request. Do not change the composition or content, only apply the style.
Request: "${stylizePrompt}"

Safety & Ethics Policy:
- Filters may subtly shift colors, but you MUST ensure they do not alter a person's fundamental race or ethnicity.
- You MUST REFUSE any request that explicitly asks to change a person's race (e.g., 'apply a filter to make me look Chinese').

Output: Return ONLY the final filtered image. Do not return text.`;
        const textPart = { text: prompt };

        console.log('Sending image and style prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [originalImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for style.', response);
        
        return handleApiResponse(response, 'stylize');
    } catch (googleError) {
        console.warn(`Google API (stylize) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            return await falImageEditFallback(stylizePrompt, [originalImage], 'stylize');
        } catch (falError) {
            console.error(`Fal AI stylize fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI stylize operation failed with both primary and fallback services.');
        }
    }
};

/**
 * Generatively expands an image by filling in transparent areas.
 * @param imageWithTransparency The image file with transparent areas to be filled.
 * @param expandPrompt The prompt describing what to fill the new area with.
 * @returns A promise that resolves to the data URL of the expanded image.
 */
export const generateExpandedImage = async (
    imageWithTransparency: File,
    expandPrompt: string
): Promise<string> => {
    try {
        console.log(`Starting generative expand with prompt: ${expandPrompt}`);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const imagePart = await fileToPart(imageWithTransparency);
        const prompt = `You are an expert photo editor AI performing an 'outpainting' or 'generative expand' task.
The user has provided an image that has been placed on a larger, transparent canvas.
Your task is to fill in the transparent areas ONLY.
The original, non-transparent part of the image MUST be preserved perfectly and remain completely unchanged.
Fill the transparent space based on this user request: "${expandPrompt}"
The new content must blend seamlessly with the original image's edges, matching the style, lighting, and perspective.

Output: Return ONLY the final, filled-in image. Do not include any text.`;
        const textPart = { text: prompt };

        console.log('Sending image and expand prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for expansion.', response);
        
        return handleApiResponse(response, 'expand');
    } catch (googleError) {
        console.warn(`Google API (expand) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            const falPrompt = `Outpaint and fill the transparent areas of the image based on this description: "${expandPrompt}". The original image content must be preserved.`;
            return await falImageEditFallback(falPrompt, [imageWithTransparency], 'expand');
        } catch (falError) {
            console.error(`Fal AI expand fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI expand operation failed with both primary and fallback services.');
        }
    }
};


/**
 * Removes the background from an image.
 * @param originalImage The original image file.
 * @returns A promise that resolves to the data URL of the image with the background removed.
 */
export const generateRemovedBgImage = async (originalImage: File): Promise<string> => {
    try {
        console.log(`Starting background removal.`);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const originalImagePart = await fileToPart(originalImage);
        const prompt = `You are an expert photo editor AI. Your task is to remove the background from this image, leaving only the main subject. The final output MUST have a transparent background.
Output ONLY the resulting image. Do not return text.`;
        const textPart = { text: prompt };

        console.log('Sending image and remove BG prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [originalImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for remove bg.', response);
        
        return handleApiResponse(response, 'remove-bg');
    } catch (googleError) {
        console.warn(`Google API (remove-bg) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            const falPrompt = "Remove the background from this image, leaving only the main subject. The final output MUST have a transparent background.";
            return await falImageEditFallback(falPrompt, [originalImage], 'remove-bg');
        } catch (falError) {
            console.error(`Fal AI remove-bg fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI background removal failed with both primary and fallback services.');
        }
    }
};


export const collageStyles = [
    { name: 'Anime', prompt: 'A vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: '80s Glam Rock', prompt: 'An 80s glam rock album cover aesthetic, with neon lights, gritty textures, and a dramatic, high-contrast look.' },
    { name: 'Sci-Fi Future', prompt: 'A futuristic sci-fi scene from 100 years in the future, with holographic elements, chrome details, and a cyberpunk feel.' },
    { name: 'Pencil Sketch', prompt: 'A detailed black and white pencil sketch, with cross-hatching and realistic shading.' },
    { name: 'Impressionism', prompt: 'An impressionist painting in the style of Monet, with visible brushstrokes and a focus on light and color.' },
    { name: 'Pop Art', prompt: 'A vibrant pop art piece in the style of Andy Warhol, with bold, contrasting colors, and a silkscreen effect.' },
    { name: 'Steampunk', prompt: 'A steampunk-inspired image, with gears, cogs, brass details, and a Victorian-era industrial feel.' },
    { name: 'Claymation', prompt: 'A charming claymation (plasticine) style, with soft textures and a handmade, stop-motion look.' },
    { name: 'Vintage Comic', prompt: 'A classic vintage comic book style from the 1960s, with halftone dots (Ben-Day dots), bold inks, and aged paper texture.' },
    { name: 'Low-Poly', prompt: 'A modern low-poly geometric art style, where the image is constructed from colorful triangles and polygons.' },
];

/**
 * Generates a collage of 10 different styles for the given image.
 * @param originalImage The original image file.
 * @returns A promise that resolves to an array of objects, each containing the style name and the data URL of the generated image.
 */
export const generateCollageImages = async (originalImage: File): Promise<{ style: string, url: string }[]> => {
    console.log('Starting collage generation...');
    
    const promises = collageStyles.map(style => 
        generateStylizedImage(originalImage, style.prompt)
            .then(url => ({ style: style.name, url }))
            .catch(error => {
                console.error(`Failed to generate collage style "${style.name}":`, error);
                return null; // Return null on failure
            })
    );

    const results = await Promise.all(promises);
    
    // Filter out any null results and return
    return results.filter((result): result is { style: string; url: string; } => result !== null);
};

/**
 * Composites the subject of an image into a new scene.
 * @param originalImage The original image file.
 * @param scenePrompt The prompt describing the new scene.
 * @returns A promise that resolves to the data URL of the new image.
 */
export const generateSceneImage = async (
    originalImage: File,
    scenePrompt: string
): Promise<string> => {
    try {
        console.log(`Starting scene generation: ${scenePrompt}`);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        const originalImagePart = await fileToPart(originalImage);
        const prompt = `You are an expert photo editor AI. Your task is to realistically composite the main subject from the provided image into a completely new scene, as described by the user.
The original subject must be seamlessly integrated into the new background, matching lighting and perspective.
User's Scene Request: "${scenePrompt}"
Output ONLY the final composited image. Do not return text.`;
        const textPart = { text: prompt };

        console.log('Sending image and scene prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [originalImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for scene.', response);

        return handleApiResponse(response, 'scene');
    } catch (googleError) {
        console.warn(`Google API (scene) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            const falPrompt = `Realistically composite the main subject from the provided image into a completely new scene, as described here: "${scenePrompt}"`;
            return await falImageEditFallback(falPrompt, [originalImage], 'scene');
        } catch (falError) {
            console.error(`Fal AI scene fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI scene generation failed with both primary and fallback services.');
        }
    }
};

/**
 * Upscales an image to 2x its original resolution.
 * @param originalImage The original image file.
 * @returns A promise that resolves to the data URL of the upscaled image.
 */
export const generateUpscaledImage = async (originalImage: File): Promise<string> => {
    try {
        console.log('Starting image upscaling...');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        const { width, height } = await getImageDimensions(originalImage);
        const targetWidth = width * 2;
        const targetHeight = height * 2;
        console.log(`Upscaling from ${width}x${height} to ${targetWidth}x${targetHeight}`);


        const originalImagePart = await fileToPart(originalImage);
        const prompt = `You are an expert photo restoration and super-resolution AI.
Your task is to take the provided image and upscale it to double its original resolution, significantly enhancing details and clarity without altering the content or composition.

The original image is ${width}x${height} pixels.
Your output MUST be a new, high-resolution image that is exactly ${targetWidth}x${targetHeight} pixels.

Instructions:
1.  **Perform Super-Resolution:** Analyze the existing pixels and intelligently add new ones to increase the overall detail and sharpness. The result should look as if the photo were originally captured with a much higher-resolution camera.
2.  **Strictly Preserve Content:** The composition, subjects, colors, and all creative aspects of the original image must be perfectly maintained. DO NOT add, remove, or change any objects or elements.
3.  **Output Image Only:** Your final output must be ONLY the upscaled image file. Do not output any text or explanations.

Execute this technical enhancement task.`;
        const textPart = { text: prompt };

        console.log('Sending image and super-resolution prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [originalImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for upscale.', response);

        return handleApiResponse(response, 'upscale');
    } catch (googleError) {
        console.warn(`Google API (upscale) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            const falPrompt = `Upscale this image to double its resolution, enhancing details and clarity without altering the content.`;
            return await falImageEditFallback(falPrompt, [originalImage], 'upscale');
        } catch (falError) {
            console.error(`Fal AI upscale fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI upscale operation failed with both primary and fallback services.');
        }
    }
};

/**
 * Generates a new image by composing two input images based on a text prompt.
 * @param image1 The base image (e.g., background).
 * @param image2 The second image (e.g., subject or style reference).
 * @param userPrompt The prompt describing how to combine the images.
 * @returns A promise that resolves to the data URL of the composited image.
 */
export const generateCompositedImage = async (
    image1: File,
    image2: File,
    userPrompt: string
): Promise<string> => {
    try {
        console.log(`Starting multi-image composition: ${userPrompt}`);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const imagePart1 = await fileToPart(image1);
        const imagePart2 = await fileToPart(image2);
        const textPart = { text: userPrompt };

        console.log('Sending multiple images and prompt to the model...');
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [textPart, imagePart1, imagePart2] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        console.log('Received response from model for composition.', response);
        
        return handleApiResponse(response, 'compose');
    } catch (googleError) {
        console.warn(`Google API (compose) failed: ${googleError instanceof Error ? googleError.message : String(googleError)}. Trying Fal AI fallback.`);
        try {
            return await falImageEditFallback(userPrompt, [image1, image2], 'compose');
        } catch (falError) {
            console.error(`Fal AI compose fallback also failed: ${falError instanceof Error ? falError.message : String(falError)}`);
            if (googleError instanceof Error) throw googleError;
            throw new Error('The AI compose operation failed with both primary and fallback services.');
        }
    }
};