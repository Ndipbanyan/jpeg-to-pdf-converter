import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Preview from './components/Preview'
import ConvertButton from './components/ConvertButton'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    try {
      setError(null)
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF()
      
      const img = new Image()
      img.src = previewUrl!
      
      img.onload = () => {
        const imgProps = pdf.getImageProperties(img)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        
        pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('converted-image.pdf')
      }
    } catch (error) {
      setError('Failed to convert image to PDF. Please try again.')
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

            {previewUrl && (
              <div className="space-y-4">
                <Preview imageUrl={previewUrl} />
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