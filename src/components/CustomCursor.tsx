import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [preview, setPreview] = useState<{ image: string; label: string } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hover-trigger');

      setIsHovering(!!isClickable);

      const previewTarget = target.closest('[data-cursor-preview]') as HTMLElement | null;
      if (previewTarget) {
        setPreview({
          image: previewTarget.dataset.cursorPreview!,
          label: previewTarget.dataset.cursorLabel || 'View',
        });
      } else {
        setPreview(null);
      }
    };

    const handleDocumentLeave = () => {
      setIsHovering(false);
      setPreview(null);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleDocumentLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleDocumentLeave);
    };
  }, []);

  // Don't render cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#1A1A1A] rounded-full pointer-events-none z-9999 mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: preview ? 0 : isHovering ? 4 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#1A1A1A]/30 rounded-full pointer-events-none z-9998"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering || preview ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      />
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 60,
              y: mousePosition.y - 60,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 w-[120px] h-[120px] rounded-sm overflow-hidden pointer-events-none z-9997 shadow-2xl"
          >
            <img src={preview.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <span className="absolute bottom-1 right-1 font-mono text-[9px] uppercase tracking-widest bg-[#1A1A1A] text-[#F5F2ED] px-1.5 py-0.5 rounded-sm">
              {preview.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
