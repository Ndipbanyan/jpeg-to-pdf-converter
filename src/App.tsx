import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Preview from './components/Preview'
import ConvertButton from './components/ConvertButton'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [compressionQuality, setCompressionQuality] = useState<number>(0.7)
  const [maxWidth, setMaxWidth] = useState<number>(1200)

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
    setError(null)
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const compressImage = (img: HTMLImageElement, quality: number, maxWidth: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to compressed JPEG (even PNG files for better compression)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    })
  }

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return

    try {
      setError(null)
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF()
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const img = new Image()
        img.src = previewUrls[i]
        
        await new Promise(async (resolve) => {
          img.onload = async () => {
            // Compress the image
            const compressedImageUrl = await compressImage(img, compressionQuality, maxWidth)
            
            // Create a new image element with compressed data
            const compressedImg = new Image()
            compressedImg.src = compressedImageUrl
            
            compressedImg.onload = () => {
              const imgProps = pdf.getImageProperties(compressedImg)
              const pdfWidth = pdf.internal.pageSize.getWidth()
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
              
              if (i > 0) {
                pdf.addPage()
              }
              
              // Use JPEG format for compressed images (better compression)
              pdf.addImage(compressedImg, 'JPEG', 0, 0, pdfWidth, pdfHeight)
              resolve(null)
            }
          }
        })
      }
      
      pdf.save('converted-images-compressed.pdf')
    } catch (error) {
      setError('Failed to convert images to PDF. Please try again.')
      console.error('Error converting to PDF:', error)
    }
  }

  return (
    <main className="min-h-screen bg-muted-background py-8">
      <div className="container">
        <div className="card p-6 sm:p-8 max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center text-foreground">
              Image to PDF Converter
            </h1>
            <p className="text-center text-muted mt-2">
              Convert your JPEG and PNG images to PDF format with customizable compression
            </p>
          </header>

          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} />
            
            {/* Compression Settings */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Compression Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="quality-slider" className="block text-sm font-medium text-gray-700 mb-2">
                    Image Quality: {Math.round(compressionQuality * 100)}%
                  </label>
                  <input
                    id="quality-slider"
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.1"
                    value={compressionQuality}
                    onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="width-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Width (pixels)
                  </label>
                  <input
                    id="width-input"
                    type="number"
                    min="400"
                    max="3000"
                    step="100"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1200)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Images wider than this will be resized (maintaining aspect ratio)
                  </p>
                </div>
              </div>
            </div>
            
            {error && (
              <div 
                role="alert" 
                className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200"
              >
                {error}
              </div>
            )}

            {previewUrls.length > 0 && (
              <div className="space-y-4">
                <Preview imageUrls={previewUrls} />
                <ConvertButton onConvert={handleConvert} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App 