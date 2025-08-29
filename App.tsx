/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import { generateEditedImage, generateStylizedImage, generateExpandedImage, generateRemovedBgImage, generateCollageImages, generateSceneImage, generateUpscaledImage, generateImageFromText, generateCompositedImage } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import StylizePanel from './components/StylizePanel';
import CropPanel from './components/CropPanel';
import ExpandPanel from './components/ExpandPanel';
import CollagePanel from './components/CollagePanel';
import ScenesPanel from './components/ScenesPanel';
import LightingPanel from './components/LightingPanel';
import UpscalePanel from './components/UpscalePanel';
import GeneratePanel from './components/GeneratePanel';
import ComposePanel from './components/ComposePanel';
import ActionsPanel from './components/ActionsPanel';
import Toolbar from './components/Toolbar';
import StartScreen from './components/StartScreen';

// Helper to convert a data URL string to a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export type Tool = 'generate' | 'retouch' | 'stylize' | 'crop' | 'expand' | 'remove-bg' | 'collage' | 'scenes' | 'lighting' | 'upscale' | 'compose';

const App: React.FC = () => {
  const [history, setHistory] = useState<File[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('AI is working its magic...');
  const [error, setError] = useState<string | null>(null);
  const [editHotspot, setEditHotspot] = useState<{ x: number, y: number } | null>(null);
  const [displayHotspot, setDisplayHotspot] = useState<{ x: number, y: number } | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('generate');
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>();
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const [collageImages, setCollageImages] = useState<{style: string, url: string}[]>([]);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);

  const [composeImageFile, setComposeImageFile] = useState<File | null>(null);
  const [expandCanvasUrl, setExpandCanvasUrl] = useState<string | null>(null);

  const currentImage = history[historyIndex] ?? null;
  const originalImage = history[0] ?? null;

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const fileToDataUrl = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
  };

  // Effect to create data URL for the current image, avoiding blob lifecycle issues
  useEffect(() => {
    if (currentImage) {
      let isCancelled = false;
      fileToDataUrl(currentImage, (dataUrl) => {
        if (!isCancelled) setCurrentImageUrl(dataUrl);
      });
      return () => { isCancelled = true; };
    } else {
      setCurrentImageUrl(null);
    }
  }, [currentImage]);

  // Effect to create data URL for the original image
  useEffect(() => {
    if (originalImage) {
      let isCancelled = false;
      fileToDataUrl(originalImage, (dataUrl) => {
        if (!isCancelled) setOriginalImageUrl(dataUrl);
      });
      return () => { isCancelled = true; };
    } else {
      setOriginalImageUrl(null);
    }
  }, [originalImage]);

  // Reset transient states when active tool changes
  useEffect(() => {
    setEditHotspot(null);
    setDisplayHotspot(null);
    if (activeTool !== 'collage') {
        setCollageImages([]);
    }
    if (activeTool !== 'compose') {
        setComposeImageFile(null);
    }
    if (activeTool !== 'crop' && activeTool !== 'expand') {
        setCrop(undefined);
        setCompletedCrop(undefined);
    }
    // If user switches away from generate and there's no image, switch to retouch
    if (!currentImage && activeTool !== 'generate') {
        setActiveTool('generate');
    }
  }, [activeTool, currentImage]);

  // Effect to create a padded canvas for the expand tool
  useEffect(() => {
    if (activeTool !== 'expand' || !currentImageUrl) {
      setExpandCanvasUrl(null);
      return;
    }

    const image = new Image();
    
    image.onload = () => {
      const paddingFactor = 3; 
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth * paddingFactor;
      canvas.height = image.naturalHeight * paddingFactor;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawX = image.naturalWidth;
        const drawY = image.naturalHeight;
        ctx.drawImage(image, drawX, drawY);
        setExpandCanvasUrl(canvas.toDataURL('image/png'));
        
        const initialCrop: PixelCrop = {
            unit: 'px',
            x: drawX,
            y: drawY,
            width: image.naturalWidth,
            height: image.naturalHeight,
        };
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
      }
    };

    image.onerror = () => {
        setError("Could not load image to prepare for expansion.");
    }

    image.src = currentImageUrl;

  }, [activeTool, currentImageUrl]);


  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addImageToHistory = useCallback((newImageFile: File) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImageFile);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    // Reset transient states after an action
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [history, historyIndex]);

  const handleImageUpload = useCallback((file: File) => {
    setError(null);
    setHistory([file]);
    setHistoryIndex(0);
    setEditHotspot(null);
    setDisplayHotspot(null);
    setActiveTool('retouch');
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);
  
  const handleGenerateFromText = useCallback(async (generationPrompt: string) => {
    if (!generationPrompt.trim()) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    if (currentImage) {
        if (!window.confirm('This will replace your current image and editing history. Are you sure you want to continue?')) {
            return;
        }
    }
    setIsLoading(true);
    setLoadingMessage('Generating your image...');
    setError(null);

    try {
        const generatedImageUrl = await generateImageFromText(generationPrompt);
        const newImageFile = dataURLtoFile(generatedImageUrl, `generated-${Date.now()}.png`);
        handleImageUpload(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate the image. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, handleImageUpload]);
  
  const handleCompose = useCallback(async (composePrompt: string) => {
    if (!currentImage || !composeImageFile) {
        setError('Please provide both images for composition.');
        return;
    }
     if (!composePrompt.trim()) {
        setError('Please describe how to combine the images.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage('Compositing images...');
    setError(null);
    try {
        const resultUrl = await generateCompositedImage(currentImage, composeImageFile, composePrompt);
        const newImageFile = dataURLtoFile(resultUrl, `composed-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to compose images. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, composeImageFile, addImageToHistory]);

  const handleGenerate = useCallback(async () => {
    if (!currentImage) return;
    if (!prompt.trim() || !editHotspot) {
      setError(!prompt.trim() ? 'Please enter a description.' : 'Please select an area to edit.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Performing localized edit...');
    setError(null);
    
    try {
        const editedImageUrl = await generateEditedImage(currentImage, prompt, editHotspot);
        const newImageFile = dataURLtoFile(editedImageUrl, `edited-${Date.now()}.png`);
        addImageToHistory(newImageFile);
        setEditHotspot(null);
        setDisplayHotspot(null);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate the image. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, prompt, editHotspot, addImageToHistory]);
  
  const handleApplyStylize = useCallback(async (stylizePrompt: string) => {
    if (!currentImage) return;
    setIsLoading(true);
    setLoadingMessage('Applying new style...');
    setError(null);
    
    try {
        const stylizedImageUrl = await generateStylizedImage(currentImage, stylizePrompt);
        const newImageFile = dataURLtoFile(stylizedImageUrl, `stylized-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to apply the style. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleApplyScene = useCallback(async (scenePrompt: string) => {
    if (!currentImage) return;
    setIsLoading(true);
    setLoadingMessage('Compositing new scene...');
    setError(null);
    
    try {
        const sceneImageUrl = await generateSceneImage(currentImage, scenePrompt);
        const newImageFile = dataURLtoFile(sceneImageUrl, `scene-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to apply the scene. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleApplyUpscale = useCallback(async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setLoadingMessage('Upscaling image (2x)...');
    setError(null);
    
    try {
        const upscaledImageUrl = await generateUpscaledImage(currentImage);
        const newImageFile = dataURLtoFile(upscaledImageUrl, `upscaled-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to upscale the image. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);
  
  const handleRemoveBackground = useCallback(async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setLoadingMessage('Removing background...');
    setError(null);

    try {
        const resultUrl = await generateRemovedBgImage(currentImage);
        const newImageFile = dataURLtoFile(resultUrl, `removed-bg-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to remove background. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleGenerateCollage = useCallback(async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setLoadingMessage('Generating 10 styles... this may take a minute.');
    setError(null);
    setCollageImages([]);
    
    try {
        const results = await generateCollageImages(currentImage);
        if (results.length === 0) {
            throw new Error("The AI failed to generate any images for the collage. This might be due to safety filters.");
        }
        setCollageImages(results);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate collage. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage]);

  const handleApplyCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );
    
    const croppedImageUrl = canvas.toDataURL('image/png');
    const newImageFile = dataURLtoFile(croppedImageUrl, `cropped-${Date.now()}.png`);
    addImageToHistory(newImageFile);

  }, [completedCrop, addImageToHistory]);
  
  const handleApplyExpand = useCallback(async (expandPrompt: string) => {
    if (!currentImageUrl || !completedCrop || !imgRef.current) return;
    if (!expandPrompt.trim()) {
        setError('Please describe what to fill the new space with.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage('Generatively expanding image...');
    setError(null);

    const image = imgRef.current; // This is the <img/> element showing the padded canvas
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(completedCrop.width * scaleX);
    canvas.height = Math.round(completedCrop.height * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setError("Could not create canvas context for expansion.");
        setIsLoading(false);
        return;
    }

    const drawX = Math.round(-completedCrop.x * scaleX);
    const drawY = Math.round(-completedCrop.y * scaleY);
    
    // imageToExpand is the original, un-padded image
    const imageToExpand = new Image();

    imageToExpand.onload = async () => {
        ctx.drawImage(imageToExpand, drawX, drawY, imageToExpand.naturalWidth, imageToExpand.naturalHeight);
        const imageWithTransparencyUrl = canvas.toDataURL('image/png');
        const imageWithTransparencyFile = dataURLtoFile(imageWithTransparencyUrl, `expand-base-${Date.now()}.png`);

        try {
            const resultUrl = await generateExpandedImage(imageWithTransparencyFile, expandPrompt);
            const newImageFile = dataURLtoFile(resultUrl, `expanded-${Date.now()}.png`);
            addImageToHistory(newImageFile);
        } catch(err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to expand the image. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    imageToExpand.onerror = () => {
        setError("Could not load image for expansion.");
        setIsLoading(false);
    };

    imageToExpand.src = currentImageUrl;
  }, [currentImageUrl, completedCrop, addImageToHistory]);


  const handleUndo = useCallback(() => canUndo && setHistoryIndex(historyIndex - 1), [canUndo, historyIndex]);
  const handleRedo = useCallback(() => canRedo && setHistoryIndex(historyIndex + 1), [canRedo, historyIndex]);
  const handleReset = useCallback(() => history.length > 0 && setHistoryIndex(0), [history]);
  const handleUploadNew = useCallback(() => {
      setHistory([]);
      setHistoryIndex(-1);
      setError(null);
      setPrompt('');
      setActiveTool('generate');
  }, []);

  const handleDownload = useCallback(() => {
      if (currentImage) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(currentImage);
          link.download = `bananatech-edit-${currentImage.name}`;
          link.click();
          URL.revokeObjectURL(link.href);
      }
  }, [currentImage]);
  
  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) handleImageUpload(files[0]);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'retouch' || !imgRef.current) return;
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // This logic correctly handles letterboxing/pillarboxing from 'object-contain'
    const { naturalWidth, naturalHeight, width, height } = img;
    const imageAspectRatio = naturalWidth / naturalHeight;
    const elementAspectRatio = width / height;

    let renderedWidth = width;
    let renderedHeight = height;
    let xOffsetInElement = 0;
    let yOffsetInElement = 0;

    if (imageAspectRatio > elementAspectRatio) { // Image is wider, letterboxed
        renderedHeight = width / imageAspectRatio;
        yOffsetInElement = (height - renderedHeight) / 2;
    } else { // Image is taller, pillarboxed
        renderedWidth = height * imageAspectRatio;
        xOffsetInElement = (width - renderedWidth) / 2;
    }

    const clickXInElement = e.clientX - rect.left;
    const clickYInElement = e.clientY - rect.top;

    // Check if click is within the actual rendered image bounds
    if (clickXInElement < xOffsetInElement || clickXInElement > xOffsetInElement + renderedWidth || clickYInElement < yOffsetInElement || clickYInElement > yOffsetInElement + renderedHeight) {
        return; // Click was in the empty space around the image
    }
    
    // Set display hotspot relative to the element's top-left for positioning the dot
    setDisplayHotspot({ x: clickXInElement, y: clickYInElement });

    // Calculate click position relative to the top-left of the *rendered image*
    const clickXInRenderedImage = clickXInElement - xOffsetInElement;
    const clickYInRenderedImage = clickYInElement - yOffsetInElement;

    // Scale coordinates to the original image dimensions for the API call
    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;
    setEditHotspot({ 
        x: Math.round(clickXInRenderedImage * scaleX), 
        y: Math.round(clickYInRenderedImage * scaleY) 
    });
  };

  const renderContent = () => {
    if (error) {
       return (
           <div className="text-center animate-fade-in bg-red-900/50 border border-red-700/60 p-8 rounded-lg max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-red-300">An Error Occurred</h2>
            <p className="text-md text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-md transition-colors">Try Again</button>
          </div>
        );
    }
    
    if (!currentImageUrl) {
      return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
            <StartScreen onFileSelect={handleFileSelect} />
            <div className="flex items-center gap-4 w-full max-w-2xl">
                <div className="flex-grow h-px bg-zinc-700"></div>
                <span className="font-semibold text-zinc-400">OR</span>
                <div className="flex-grow h-px bg-zinc-700"></div>
            </div>
            <div className="w-full max-w-2xl">
                 <GeneratePanel onGenerate={handleGenerateFromText} isLoading={isLoading} />
            </div>
        </div>
      );
    }
    
    const cropComponent = (
        <ReactCrop 
          crop={crop} 
          onChange={c => setCrop(c)} 
          onComplete={c => setCompletedCrop(c)}
          aspect={activeTool === 'crop' ? aspect : undefined}
          className="max-h-[70vh]"
          disabled={activeTool !== 'crop' && activeTool !== 'expand'}
        >
          <img 
            ref={imgRef}
            key={activeTool === 'expand' ? `expand-${currentImageUrl}` : `crop-${currentImageUrl}`}
            src={(activeTool === 'expand' && expandCanvasUrl) ? expandCanvasUrl : currentImageUrl!} 
            alt="Main image to edit"
            className="w-full h-auto object-contain max-h-[70vh] rounded-xl"
            style={activeTool === 'expand' ? { backgroundColor: 'rgba(0,0,0,0.2)' } : {}}
          />
        </ReactCrop>
      );

    const imageDisplay = (
      <div className="relative cursor-crosshair" onClick={handleImageClick}>
        {originalImageUrl && (
            <img key={originalImageUrl} src={originalImageUrl} alt="Original" className="w-full h-auto object-contain max-h-[70vh] rounded-xl pointer-events-none" />
        )}
        <img
            ref={imgRef}
            key={currentImageUrl}
            src={currentImageUrl}
            alt="Current"
            className={`absolute top-0 left-0 w-full h-auto object-contain max-h-[70vh] rounded-xl transition-opacity duration-200 ease-in-out ${isComparing ? 'opacity-0' : 'opacity-100'}`}
        />
         {activeTool === 'retouch' && !editHotspot && !isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold pointer-events-none animate-fade-in rounded-xl">
                Click an area on the image to make a precise edit.
            </div>
        )}
        {displayHotspot && activeTool === 'retouch' && (
            <div 
                className="absolute w-6 h-6 bg-yellow-400/80 border-2 border-white rounded-full -translate-x-3 -translate-y-3 pointer-events-none shadow-lg" 
                style={{ left: displayHotspot.x, top: displayHotspot.y }}
            ></div>
        )}
      </div>
    );

    return (
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Toolbar activeTool={activeTool} onSetTool={setActiveTool} hasImage={!!currentImage} />

          <div className="w-full">
              {activeTool === 'generate' && <GeneratePanel onGenerate={handleGenerateFromText} isLoading={isLoading} />}
              {activeTool === 'retouch' && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <p className="text-md text-zinc-400">
                          {editHotspot ? 'Great! Now describe your localized edit below.' : 'First, click a point on the image.'}
                      </p>
                      <input
                          type="text"
                          value={prompt}
                          onChange={(e) => { setPrompt(e.target.value); setError(null); }}
                          placeholder="e.g., 'add a hat' or 'make the shirt blue'"
                          className="flex-grow bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
                          disabled={isLoading}
                      />
                      <button
                          onClick={handleGenerate}
                          className="w-full bg-yellow-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                          disabled={isLoading || !prompt.trim() || !editHotspot}
                      >
                          Apply Localized Edit
                      </button>
                  </div>
              )}
              {activeTool === 'stylize' && <StylizePanel onApplyStylize={handleApplyStylize} isLoading={isLoading} />}
              {activeTool === 'scenes' && <ScenesPanel onApplyScene={handleApplyScene} isLoading={isLoading} />}
              {activeTool === 'lighting' && <LightingPanel onApplyLighting={handleApplyStylize} isLoading={isLoading} />}
              {activeTool === 'compose' && <ComposePanel onCompose={handleCompose} isLoading={isLoading} currentImageUrl={currentImageUrl} onFileSelect={setComposeImageFile} />}
              {activeTool === 'remove-bg' && (
                  <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-zinc-300">Remove Background</h3>
                      <p className="text-sm text-zinc-400 -mt-2 text-center">Click the button to automatically remove the background, leaving a transparent result.</p>
                      <button onClick={handleRemoveBackground} disabled={isLoading} className="w-full max-w-xs bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none">
                          Remove Background
                      </button>
                  </div>
              )}
              {activeTool === 'crop' && <CropPanel onApplyCrop={handleApplyCrop} onSetAspect={setAspect} isLoading={isLoading} isCropping={!!completedCrop?.width} />}
              {activeTool === 'expand' && <ExpandPanel onApplyExpand={handleApplyExpand} isLoading={isLoading} isExpanding={!!completedCrop?.width} />}
              {activeTool === 'upscale' && <UpscalePanel onApplyUpscale={handleApplyUpscale} isLoading={isLoading} />}
              {activeTool === 'collage' && <CollagePanel onGenerateCollage={handleGenerateCollage} isLoading={isLoading} collageImages={collageImages} onImageClick={setFullscreenImageUrl} />}
          </div>

          <ActionsPanel 
            onUploadNew={handleUploadNew}
            onDownload={handleDownload}
            onUndo={handleUndo}
            canUndo={canUndo}
            onRedo={handleRedo}
            canRedo={canRedo}
            onReset={handleReset}
            onCompare={setIsComparing}
            isOriginal={historyIndex === 0}
          />
        </div>

        {/* Right Panel: Image Display */}
        <div className="lg:col-span-8 flex items-center justify-center bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 min-h-[400px]">
           {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
              <Spinner />
              <h2 className="text-xl font-semibold text-zinc-200">{loadingMessage}</h2>
              <p className="text-md text-zinc-400 max-w-sm">Please keep this window open. Complex AI tasks can sometimes take up to a minute.</p>
            </div>
           ) : (
            <div className="w-full h-full flex items-center justify-center">
              {activeTool === 'crop' || activeTool === 'expand' ? cropComponent : imageDisplay}
            </div>
           )}
        </div>

        {fullscreenImageUrl && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center animate-fade-in"
            onClick={() => setFullscreenImageUrl(null)}
          >
            <img src={fullscreenImageUrl} alt="Fullscreen collage image" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;