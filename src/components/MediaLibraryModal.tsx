import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  title?: string;
  currentImageUrl?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = "Select or Upload Image",
  currentImageUrl = ""
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [images, setImages] = useState<Array<{ filename: string; url: string }>>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImageUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing images from server
  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
        }
      }
    } catch (err) {
      console.error("Failed to load media library images", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedUrl(currentImageUrl);
    }
  }, [isOpen, currentImageUrl]);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            filename: file.name.replace(/\.[^/.]+$/, ''),
            prefix: 'wp_media'
          })
        });

        if (res.ok) {
          const json = await res.json();
          await fetchImages();
          setSelectedUrl(json.url);
          setActiveTab('library');
        } else {
          setUploadError("Failed to upload image. Try another format.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError("Network error while uploading.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete image permanently
  const handleDeleteImage = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${filename}" permanently from Media Library?`)) return;

    try {
      const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.filename !== filename));
        if (selectedUrl.includes(filename)) {
          setSelectedUrl('');
        }
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  // Filtered images
  const filteredImages = images.filter(img => 
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmSelect = () => {
    if (activeTab === 'url' && customUrlInput.trim()) {
      onSelectImage(customUrlInput.trim());
    } else if (selectedUrl) {
      onSelectImage(selectedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#f0f0f1] text-[#2c3338] rounded-xl max-w-4xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* WordPress Media Modal Header */}
        <div className="bg-[#1d2327] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#2271b1] flex items-center justify-center text-xs font-bold">
              W
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Upload Files / Media Library / Insert from URL) */}
        <div className="bg-white px-5 pt-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload files</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media Library ({images.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Insert from URL</span>
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative pb-2 hidden sm:block">
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-7 pr-3 py-1 rounded-md border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#2271b1]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          
          {/* TAB 1: UPLOAD FILES */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="wp-media-file-input"
              />

              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-1">
                Drop files to upload
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                or click below to choose an image from your computer
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Select Files</span>
                  </>
                )}
              </button>

              {uploadError && (
                <p className="text-xs text-rose-600 mt-3 font-semibold">{uploadError}</p>
              )}

              <p className="text-[11px] text-slate-400 mt-6">
                Maximum upload file size: 20 MB. Supported formats: JPG, PNG, WEBP, SVG.
              </p>
            </div>
          )}

          {/* TAB 2: MEDIA LIBRARY GRID */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {filteredImages.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No media items found</p>
                  <p className="text-xs mt-1">Upload an image in the "Upload files" tab to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredImages.map((img) => {
                    const isSelected = selectedUrl === img.url;
                    return (
                      <div
                        key={img.url}
                        onClick={() => setSelectedUrl(img.url)}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-slate-100 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#2271b1] ring-2 ring-[#2271b1]/40 shadow-md'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.filename}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Hover Overlay with Delete & Filename */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] truncate max-w-[80%] font-medium">
                            {img.filename}
                          </span>
                          <button
                            onClick={(e) => handleDeleteImage(img.filename, e)}
                            className="text-rose-400 hover:text-rose-200 p-0.5"
                            title="Delete image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INSERT FROM URL */}
          {activeTab === 'url' && (
            <div className="max-w-xl mx-auto py-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Image Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 focus:border-[#2271b1] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedUrl(customUrlInput)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {(customUrlInput || selectedUrl) && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-center">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Image Preview</p>
                  <img
                    src={customUrlInput || selectedUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="max-h-56 mx-auto rounded-lg object-contain border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/pesticide-bottle.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* WordPress Media Modal Footer */}
        <div className="bg-[#f0f0f1] px-5 py-3 border-t border-slate-300 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600 truncate max-w-sm">
            {selectedUrl ? (
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800">Selected:</span>
                <span className="truncate">{selectedUrl}</span>
              </span>
            ) : (
              <span>No image selected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-xs"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmSelect}
              disabled={!selectedUrl && (!customUrlInput || activeTab !== 'url')}
              className="px-5 py-2 text-xs font-bold text-white bg-[#2271b1] hover:bg-[#135e96] rounded-lg transition-colors shadow-sm disabled:opacity-50"
              id="wp-media-select-btn"
            >
              Select Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
