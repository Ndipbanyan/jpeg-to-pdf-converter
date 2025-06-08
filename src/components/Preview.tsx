interface PreviewProps {
  imageUrl: string
}

const Preview = ({ imageUrl }: PreviewProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">Preview</h2>
      <div className="card overflow-hidden">
        <img
          src={imageUrl}
          alt="Preview of selected image"
          className="w-full h-auto max-h-96 object-contain"
          role="img"
          aria-label="Preview of selected image"
        />
      </div>
    </div>
  )
}

export default Preview 