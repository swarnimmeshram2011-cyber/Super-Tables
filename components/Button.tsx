import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  
  const baseStyles = "font-bold rounded-2xl transform transition-all duration-200 active:scale-95 shadow-[0_6px_0_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-[6px] flex items-center justify-center gap-2 relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-b from-blue-400 to-blue-500 text-white border-b-4 border-blue-700 hover:brightness-110",
    secondary: "bg-gradient-to-b from-yellow-300 to-yellow-400 text-yellow-900 border-b-4 border-yellow-600 hover:brightness-110",
    danger: "bg-gradient-to-b from-red-400 to-red-500 text-white border-b-4 border-red-700 hover:brightness-110",
    success: "bg-gradient-to-b from-green-400 to-green-500 text-white border-b-4 border-green-700 hover:brightness-110",
    outline: "bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
    glass: "bg-white/50 backdrop-blur border-2 border-white text-gray-700 hover:bg-white/80 shadow-sm"
  };

  const sizes = {
    sm: "text-sm py-2 px-4",
    md: "text-lg py-3 px-6",
    lg: "text-2xl py-5 px-10 w-full"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      {children}
    </button>
  );
};