// If your StatBar component doesn't have size prop, add it:
interface StatBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatBar({ label, current, max, color, showNumbers = true, size = 'md' }: StatBarProps) {
  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  
  const sizeClasses = {
    sm: 'h-1.5 text-xs',
    md: 'h-2.5 text-sm',
    lg: 'h-3.5 text-base'
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={`${sizeClasses[size]} text-muted-foreground`}>{label}</span>
        {showNumbers && (
          <span className={`${sizeClasses[size]} font-bold`} style={{ color }}>
            {current}/{max}
          </span>
        )}
      </div>
      <div className={`w-full bg-black/50 rounded-full ${sizeClasses[size]}`}>
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${percent}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}