import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, style, ...props }) => {
    const inputId = id || props.name;

    return (
        <div className={`input-group ${className}`} style={{ marginBottom: '1rem', width: '100%' }}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--text-main)'
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                style={{
                    ...style,
                    borderColor: error ? 'var(--error)' : undefined
                }}
                {...props}
            />
            {error && (
                <p style={{
                    marginTop: '0.25rem',
                    fontSize: '0.85rem',
                    color: 'var(--error)'
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};
