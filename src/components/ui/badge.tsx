import { cn } from '@/lib/utils';
import { badgeVariants, type BadgeProps } from '@/lib/variants/badge';

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
