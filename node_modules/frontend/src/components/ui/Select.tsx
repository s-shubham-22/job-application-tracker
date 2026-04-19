import React, { forwardRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerStyle?: React.CSSProperties;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, style, containerStyle, children, onClick, onBlur, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLSelectElement>) => {
      setIsOpen(!isOpen);
      if (onClick) onClick(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsOpen(false);
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIsOpen(false);
      if (onChange) onChange(e);
    };

    return (
      <div style={{ position: 'relative', display: 'inline-block', width: style?.width || '100%', ...containerStyle }}>
        <select
          ref={ref}
          onClick={handleClick}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`input ${className || ''}`}
          style={{ ...style, appearance: 'none', paddingRight: 36 }}
          {...props}
        >
          {children}
        </select>
        <div 
          style={{ 
            position: 'absolute', 
            right: 12, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none', 
            color: 'var(--text-muted)' 
          }}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
