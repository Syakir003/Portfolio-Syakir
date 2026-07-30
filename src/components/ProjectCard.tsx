import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from '../types';
import useReducedMotion from '../hooks/useReducedMotion';

interface ProjectCardProps {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ProjectCard({ project, index, isExpanded, onToggle }: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const detailTransition = reducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' as const };

  return (
    <motion.div
      layout
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={`group cursor-pointer hover-trigger ${isExpanded ? 'md:col-span-2' : ''}`}
      onClick={onToggle}
      data-cursor-preview={project.image}
      data-cursor-label={isExpanded ? 'Close' : 'View'}
    >
      <motion.div layout className="overflow-hidden mb-8 bg-[#EAE6DF] rounded-sm">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-4/3 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display font-bold text-3xl md:text-4xl group-hover:tracking-widest transition-all duration-500 uppercase">
            {project.title}
          </h3>
          <ArrowRight
            className={`transition-all duration-500 text-[#1A1A1A] ${isExpanded ? 'rotate-90' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}
            strokeWidth={1.5}
            size={28}
          />
        </div>
        <p className="text-[#1A1A1A]/60 font-light leading-relaxed max-w-md">
          {project.description}
        </p>
        <span className="font-mono text-[15px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 mt-2">
          {project.date}
        </span>

        <AnimatePresence>
          {isExpanded && (project.role || project.techStack || project.highlights) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={detailTransition}
              className="mt-4 pt-6 border-t border-[#1A1A1A]/10 flex flex-col gap-4 overflow-hidden"
            >
              {project.role && (
                <p className="text-sm font-medium text-[#1A1A1A]/80">{project.role}</p>
              )}
              {project.techStack && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border border-[#1A1A1A]/15 rounded-full text-xs font-mono uppercase tracking-wide text-[#1A1A1A]/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {project.highlights && (
                <ul className="flex flex-col gap-2">
                  {project.highlights.map((point) => (
                    <li
                      key={point}
                      className="text-sm text-[#1A1A1A]/60 font-light leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#1A1A1A]/30"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
