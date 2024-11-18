import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full', className)} {...props} />
));
Chart.displayName = 'Chart';

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950',
      className
    )}
    {...props}
  />
));
ChartTooltip.displayName = 'ChartTooltip';

const Line = RechartsPrimitive.Line;
const Area = RechartsPrimitive.Area;
const Bar = RechartsPrimitive.Bar;
const XAxis = RechartsPrimitive.XAxis;
const YAxis = RechartsPrimitive.YAxis;
const CartesianGrid = RechartsPrimitive.CartesianGrid;
const Tooltip = RechartsPrimitive.Tooltip;
const Legend = RechartsPrimitive.Legend;
const ResponsiveContainer = RechartsPrimitive.ResponsiveContainer;

export {
  Chart,
  ChartTooltip,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
};