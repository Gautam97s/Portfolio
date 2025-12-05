import React from 'react';

interface LabelProps {
  text?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ 
  text = "Building", 
  className = "" 
}) => {
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-regular bg-red-200/90 dark:bg-red-900 text-black dark:text-white ${className}`}
      style={{
        textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
      }}
    >
      <span 
        className="w-2 h-2 rounded-full bg-red-500 blink-dot"
        style={{
          boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)',
        }}
      />
      {text}
    </span>
  );
};

