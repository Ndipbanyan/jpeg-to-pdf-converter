interface FileUploadProps {
  onFileSelect: (files: File[]) => void
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const jpegFiles = files.filter(file => file.type === 'image/jpeg')
    
    if (jpegFiles.length > 0) {
      onFileSelect(jpegFiles)
    } else {
      alert('Please select JPEG files')
    }
  }

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
        bg-muted-background hover:bg-muted/50 transition-colors duration-200
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            className="w-12 h-12 mb-4 text-muted" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 16"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-muted">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted">JPEG files only (multiple files supported)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept=".jpg,.jpeg"
          multiple
          onChange={handleFileChange}
          aria-label="Upload JPEG files"
        />
      </label>
    </div>
  )
}

export default FileUpload 