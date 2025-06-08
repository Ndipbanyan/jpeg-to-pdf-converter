import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Preview from './components/Preview'
import ConvertButton from './components/ConvertButton'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
    setError(null)
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
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
        
        await new Promise((resolve) => {
          img.onload = () => {
            const imgProps = pdf.getImageProperties(img)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
            
            if (i > 0) {
              pdf.addPage()
            }
            
            pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight)
            resolve(null)
          }
        })
      }
      
      pdf.save('converted-images.pdf')
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
              JPEG to PDF Converter
            </h1>
            <p className="text-center text-muted mt-2">
              Convert your JPEG images to PDF format easily
            </p>
          </header>

          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} />
            
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