interface ColorBandProps {
  width?: string;
  height?: string;
  className?: string;
}

const ColorBand = ({ 
  width = 'w-2/3', 
  height = 'h-1', 
  className = '' 
}: ColorBandProps) => {
  return (
    <div className={`${width} ${height} mt-2 flex ${className}`}>
      <div className="w-1/2 bg-secondary"></div>
      <div className="w-1/2 bg-primary"></div>
    </div>
  );
};

export default ColorBand;

