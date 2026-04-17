import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, icon: Icon, subValue, className }) => {
  return (
    <div className={cn("bg-white border-line border p-6 flex flex-col justify-between group hover:bg-ink hover:text-white transition-colors duration-300", className)}>
      <div className="flex justify-between items-start">
        <span className="col-label group-hover:text-white/60">{label}</span>
        <Icon className="w-4 h-4 opacity-40 group-hover:opacity-100" />
      </div>
      <div className="mt-4">
        <div className="mono-value text-3xl font-medium">{value}</div>
        {subValue && (
          <div className="text-[10px] uppercase tracking-widest mt-1 opacity-50 group-hover:text-white/40">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
