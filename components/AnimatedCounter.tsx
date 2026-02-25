import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, times: [0, 0.9, 1] },
      });
    }
  }, [controls, inView]);

  return (
    <motion.span ref={ref} animate={controls} className={className}>
      {value}
    </motion.span>
  );
};

export default AnimatedCounter;
