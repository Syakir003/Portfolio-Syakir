import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export default function CommandPalette({ items }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
        return;
      }
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          item.onSelect();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, activeIndex]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const overlayTransition = reducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          className="fixed inset-0 z-500 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-6"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={overlayTransition}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#F5F2ED] rounded-sm border border-[#1A1A1A]/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A1A1A]/10">
              <Search size={18} strokeWidth={1.5} className="text-[#1A1A1A]/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik untuk mencari..."
                className="flex-1 bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 font-light"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/30 border border-[#1A1A1A]/15 rounded px-1.5 py-0.5">Esc</span>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-5 py-6 text-sm text-[#1A1A1A]/40 font-light">Tidak ada hasil.</p>
              )}
              {filtered.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                    index === activeIndex ? 'bg-[#1A1A1A]/5' : ''
                  }`}
                >
                  <span className="text-[#1A1A1A] font-light">{item.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">{item.group}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
