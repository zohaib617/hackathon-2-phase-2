import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input component props
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
}

/**
 * Input component
 * Production-ready input field with label, error, and helper text support
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error="Invalid email address"
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-secondary-900"
          >
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left element */}
          {leftElement && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-500">
              {leftElement}
            </div>
          )}

          {/* Input field */}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 transition-colors',
              'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-secondary-100 disabled:text-secondary-500',
              hasError && 'border-red-600 focus:border-red-600 focus:ring-red-600',
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right element */}
          {rightElement && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-500">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-secondary-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
