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
  { icon: siJavascript, top: '12%', left: '8%', size: 48, duration: 7, delay: 0 },
  { icon: siPhp, top: '68%', left: '6%', size: 56, duration: 8, delay: 0.5 },
  { icon: siPython, top: '18%', left: '88%', size: 52, duration: 6.5, delay: 1 },
  { icon: siReact, top: '78%', left: '84%', size: 44, duration: 9, delay: 1.5 },
  { icon: siLaravel, top: '46%', left: '93%', size: 40, duration: 7.5, delay: 0.8 },
  { icon: siVuedotjs, top: '85%', left: '38%', size: 42, duration: 6, delay: 2 },
  { icon: siTypescript, top: '6%', left: '55%', size: 38, duration: 8.5, delay: 0.3 },
  { icon: siNodedotjs, top: '55%', left: '3%', size: 46, duration: 7, delay: 1.8 },
  { icon: siMysql, top: '30%', left: '75%', size: 40, duration: 9.5, delay: 0.6 },
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
          <svg viewBox="0 0 24 24" width={size} height={size} style={{ opacity: 0.12 }}>
            <path d={icon.path} fill={`#${icon.hex}`} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
