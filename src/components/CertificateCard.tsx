import { motion, Variants } from 'framer-motion';
import { Certificate } from '../types';
import useTilt from '../hooks/useTilt';

interface CertificateCardProps {
  cert: Certificate;
  fadeUp: Variants;
}

export default function CertificateCard({ cert, fadeUp }: CertificateCardProps) {
  const tilt = useTilt(5);

  return (
    <motion.div
      ref={tilt.ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeUp}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="group hover-trigger"
    >
      <div className="overflow-hidden mb-8 bg-[#EAE6DF] p-8 border border-[#1A1A1A]/5">
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full aspect-4/3 object-contain opacity-100 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
      </div>
      <h3 className="font-display font-bold text-xl mb-4 leading-snug group-hover:tracking-widest transition-all duration-500 uppercase">
        {cert.title}
      </h3>
      <div className="flex flex-col gap-2 mb-4">
        <p className="text-[#1A1A1A]/80 font-medium text-xs">{cert.issuer}</p>
        <p className="font-mono text-[15px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40">{cert.date}</p>
      </div>
      {cert.description && (
        <p className="text-[#1A1A1A]/60 font-light leading-relaxed text-xs">{cert.description}</p>
      )}
    </motion.div>
  );
}
