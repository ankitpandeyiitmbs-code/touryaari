import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'orange' | 'outline' | 'white';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  primary: 'bg-primary text-white',
  accent: 'bg-accent text-white',
  orange: 'bg-highlight text-white',
  outline: 'border-2 border-primary text-primary bg-transparent',
  white: 'bg-white text-primary',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
