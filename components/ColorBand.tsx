interface ColorBandProps {
  width?: string;
  height?: string;
  className?: string;
  leftColor?: 'primary' | 'secondary';
  rightColor?: 'primary' | 'secondary';
}

const ColorBand = ({ 
  width = 'w-2/3', 
  height = 'h-1', 
  className = '',
  leftColor = 'secondary', // Default to secondary on left
  rightColor = 'primary' // Default to primary on right
}: ColorBandProps) => {
  return (
    <div className={`${width} ${height} mt-2 flex ${className}`}>
      <div className={`w-1/2 ${leftColor === 'secondary' ? 'bg-secondary' : 'bg-primary'}`}></div>
      <div className={`w-1/2 ${rightColor === 'secondary' ? 'bg-secondary' : 'bg-primary'}`}></div>
    </div>
  );
};

export default ColorBand;

