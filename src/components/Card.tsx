import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)} 
      {...props} 
    />
  );
}
