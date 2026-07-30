import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const metrics: Metric[] = [
  { prefix: 'Rp', value: 30, suffix: 'jt+', label: 'Nilai proyek yang dipimpin' },
  { value: 3, label: 'Developer dipimpin' },
  { value: 150, suffix: '+', label: 'Bug diperbaiki' },
  { value: 24, label: 'Anggota divisi dipimpin' },
];

function StatCounter({ metric, delay, reducedMotion }: { metric: Metric; delay: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      count.set(metric.value);
      return;
    }
    const controls = animate(count, metric.value, { duration: 1.4, delay, ease: 'easeOut' });
    return () => controls.stop();
  }, [inView, reducedMotion, metric.value, delay, count]);

  return (
    <span ref={ref}>
      {metric.prefix}{display}{metric.suffix}
    </span>
  );
}

export default function MetricsSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="metrics" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="hairline mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.08, ease: 'easeOut' }}
              className="flex flex-col gap-2"
            >
              <div className="font-mono tabular-nums text-4xl md:text-6xl font-medium tracking-tight">
                <StatCounter metric={metric} delay={index * 0.08} reducedMotion={reducedMotion} />
              </div>
              <p className="text-sm md:text-base text-[#1A1A1A]/50 font-light uppercase tracking-[0.15em]">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
