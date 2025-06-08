interface PreviewProps {
  imageUrls: string[]
}

const Preview = ({ imageUrls }: PreviewProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">Preview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {imageUrls.map((url, index) => (
          <div key={url} className="card overflow-hidden">
            <img
              src={url}
              alt={`Preview of image ${index + 1}`}
              className="w-full h-auto max-h-48 object-contain"
              role="img"
              aria-label={`Preview of image ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Preview 