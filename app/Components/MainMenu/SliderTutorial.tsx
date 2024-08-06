import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SliderTutorial = ({ controlId, targetValue, onComplete }: {controlId: number, targetValue: number, onComplete: () => void}) => {
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const sliderElement = document.querySelector(`input[type="range"][data-control-id="${controlId}"]`);
    if (sliderElement) {
      const rect = sliderElement.getBoundingClientRect();
      const percentage = (targetValue - sliderElement.min) / (sliderElement.max - sliderElement.min);
      const xPosition = rect.left + (rect.width * percentage);
      setHandPosition({ x: xPosition, y: rect.top + window.scrollY + 10 });
    }
  }, [controlId, targetValue]);

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isAnimating ? 1 : 0,
          scale: isAnimating ? 1 : 0.5,
          x: handPosition.x,
          y: handPosition.y
        }}
        transition={{ duration: 0.5 }}
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.47 3.07a.5.5 0 0 1 .83.55l-8.16 12.24a1 1 0 0 1-1.64.04l-4-5a1 1 0 0 1 1.56-1.25l3.23 4.04 7.18-10.62z" fill="#3B82F6"/>
        </svg>
      </motion.div>
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={startAnimation}
      >
        Show Tutorial
      </button>
    </>
  );
};

export default SliderTutorial;