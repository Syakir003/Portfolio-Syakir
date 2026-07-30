import { motion } from 'framer-motion';
import {
  siJavascript,
  siPhp,
  siPython,
  siReact,
  siLaravel,
  siVuedotjs,
  siTypescript,
  siNodedotjs,
  siMysql,
} from 'simple-icons';
import useReducedMotion from '../hooks/useReducedMotion';

const icons = [
  { icon: siJavascript, top: '12%', left: '8%', size: 72, duration: 7, delay: 0 },
  { icon: siPhp, top: '68%', left: '6%', size: 84, duration: 8, delay: 0.5 },
  { icon: siPython, top: '18%', left: '86%', size: 78, duration: 6.5, delay: 1 },
  { icon: siReact, top: '78%', left: '80%', size: 66, duration: 9, delay: 1.5 },
  { icon: siLaravel, top: '46%', left: '90%', size: 60, duration: 7.5, delay: 0.8 },
  { icon: siVuedotjs, top: '85%', left: '36%', size: 64, duration: 6, delay: 2 },
  { icon: siTypescript, top: '6%', left: '52%', size: 58, duration: 8.5, delay: 0.3 },
  { icon: siNodedotjs, top: '55%', left: '2%', size: 70, duration: 7, delay: 1.8 },
  { icon: siMysql, top: '30%', left: '72%', size: 60, duration: 9.5, delay: 0.6 },
];

export default function TechStackBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {icons.map(({ icon, top, left, size, duration, delay }) => (
        <motion.div
          key={icon.slug}
          className="absolute"
          style={{ top, left, width: size, height: size }}
          animate={reducedMotion ? {} : { y: [0, -16, 0], rotate: [0, 5, 0] }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration, delay, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <svg viewBox="0 0 24 24" width={size} height={size} style={{ opacity: 0.28 }}>
            <path d={icon.path} fill={`#${icon.hex}`} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
