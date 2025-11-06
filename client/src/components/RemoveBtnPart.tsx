import React, { useState, useRef } from "react";

const RemoveBtnPart: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxFileSize = 10 * 1024 * 1024; 

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WEBP)");
      return false;
    }
    if (file.size > maxFileSize) {
      setError("File size must be less than 10MB");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setFileName(file.name);
        
        // Here you would typically:
        // 1. Upload to your backend API
        // 2. Process the image
        // 3. Navigate to results page
        console.log("Image loaded:", file.name, "Size:", file.size);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          handleFileSelect(blob);
        }
        break;
      }
    }
  };

  const handleURLSubmit = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      try {
        new URL(url);
        
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "image-from-url.jpg", { type: blob.type });
            handleFileSelect(file);
          })
          .catch(() => {
            setError("Failed to load image from URL");
          });
      } catch {
        setError("Please enter a valid URL");
      }
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center px-4 my-20"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-sans font-bold mb-3">
          Remove Image Background.
        </h1>
        <p style={{ color: 'var(--text)', opacity: 0.7 }}>
          Get a transparent background for any image.
        </p>
      </div>

      <div 
        className="relative rounded-2xl w-full max-w-lg p-10 text-center transition-all duration-300"
        style={{
          backgroundColor: 'var(--background)',
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          boxShadow: isDragging ? '0 8px 30px rgba(249, 115, 22, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <img 
          src={selectedImage || "/OIP.webp"}
          alt="Upload" 
          className="w-full h-56 object-cover rounded-lg mb-7" 
        />

        {fileName && (
          <p className="text-sm mb-3" style={{ color: 'var(--primary)' }}>
            Selected: {fileName}
          </p>
        )}

        <button
          onClick={handleUploadClick}
          className="px-8 py-3 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {selectedImage ? "Upload Another" : "Upload Image"}
        </button>

        <p style={{ color: 'var(--text)', opacity: 0.7 }} className="mt-3">
          or drop a file, <br />
          <span className="text-xs flex items-center justify-center gap-1">
            paste image or{" "}
            <p 
              onClick={handleURLSubmit}
              className="cursor-pointer underline hover:no-underline"
              style={{ color: 'var(--primary)' }}
            >
              URL
            </p>
          </span>
        </p>

        {error && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            {error}
          </div>
        )}

        {isDragging && (
          <div 
            className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
              Drop your image here
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="mt-4 p-4 rounded-lg text-sm max-w-lg w-full"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
        >
          <p className="font-semibold mb-1">✓ Image loaded successfully!</p>
          <p className="text-xs opacity-80">Ready to process. Click the button below to continue.</p>
        </div>
      )}

      <div className="text-center mt-6 text-sm max-w-md" style={{ color: 'var(--text)', opacity: 0.6 }}>
        <p className="text-xs">
          By uploading an image or URL you agree to our{" "}
          <a href="#" className="underline hover:no-underline" style={{ color: 'var(--primary)' }}>
            Terms of Service
          </a>
          . To learn more about how we handle your personal data, check our{" "}
          <a href="#" className="underline hover:no-underline" style={{ color: 'var(--primary)' }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default RemoveBtnPart;