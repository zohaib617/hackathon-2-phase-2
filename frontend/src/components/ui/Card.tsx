import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'default' | 'bordered' | 'elevated';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component
 * Container component with consistent styling
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white transition-all',
          {
            'border border-secondary-200': variant === 'bordered',
            'shadow-soft': variant === 'default',
            'shadow-medium hover:shadow-hard': variant === 'elevated',
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader component props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader component
 * Header section of a card
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component props
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * CardTitle component
 * Title element for card header
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight text-secondary-900', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component props
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * CardDescription component
 * Description element for card header
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-secondary-600', className)}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component props
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent component
 * Main content area of a card
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('pt-0', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter component props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter component
 * Footer section of a card
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-0', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
