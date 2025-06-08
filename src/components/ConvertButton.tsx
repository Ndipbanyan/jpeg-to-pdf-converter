interface ConvertButtonProps {
  onConvert: () => void
}

const ConvertButton = ({ onConvert }: ConvertButtonProps) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onConvert}
        className="btn btn-primary"
        aria-label="Convert image to PDF"
      >
        Convert to PDF
      </button>
    </div>
  )
}

export default ConvertButton 