import { type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white',
        {
          '': variant === 'default',
          'border border-gray-200': variant === 'bordered',
          'shadow-lg': variant === 'elevated',
        },
        className
      )}
      {...props}
    />
  )
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export type CardContentProps = HTMLAttributes<HTMLDivElement>

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6', className)} {...props} />
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement>

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
