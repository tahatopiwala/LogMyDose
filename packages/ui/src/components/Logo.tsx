import { cn } from '../utils/cn'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn(
          'bg-primary-600 rounded-lg flex items-center justify-center',
          sizes[size].icon
        )}
      >
        <span className="text-white font-bold text-sm">D</span>
      </div>
      {showText && (
        <span className={cn('font-bold text-gray-900', sizes[size].text)}>
          DoseTrack
        </span>
      )}
    </div>
  )
}
