import React from 'react';
import { cn } from '../lib/utils';

interface WordCloudProps {
  feedback: string[];
}

export const WordCloud: React.FC<WordCloudProps> = ({ feedback }) => {
  const words = React.useMemo(() => {
    const freq: Record<string, number> = {};
    feedback.forEach((f) => {
      f.split(' ').forEach((w) => {
        const clean = w.toLowerCase().replace(/[^a-z]/g, '');
        if (clean.length > 3) {
          freq[clean] = (freq[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40);
  }, [feedback]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center p-8 bg-white border border-line min-h-[250px]">
      {words.map(([word, count]) => {
        const size = Math.min(32, 12 + count * 2);
        const opacity = Math.min(1, 0.3 + count * 0.1);
        return (
          <span
            key={word}
            className={cn(
              "font-serif italic cursor-default hover:text-accent transition-colors",
              count > 5 ? "font-bold" : "font-normal"
            )}
            style={{ fontSize: `${size}px`, opacity }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
