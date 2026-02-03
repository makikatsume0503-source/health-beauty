import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    ...props
}) => {
    // Base classes handled by globals.css mostly, but we add some utility logic here
    let variantClass = '';
    if (variant === 'primary') variantClass = 'btn-primary';
    else if (variant === 'outline') variantClass = 'btn-outline';
    else if (variant === 'ghost') variantClass = 'bg-transparent hover:bg-gray-50';

    const sizeStyle: React.CSSProperties =
        size === 'sm' ? { padding: '0.5rem 1rem', fontSize: '0.875rem' } :
            size === 'lg' ? { padding: '1rem 3rem', fontSize: '1.25rem' } :
                {}; // md is default in css

    return (
        <button
            className={`btn ${variantClass} ${className}`}
            style={{ ...sizeStyle, opacity: isLoading || props.disabled ? 0.7 : 1 }}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" />
                    </svg>
                    Processing...
                </span>
            ) : children}
        </button>
    );
};
