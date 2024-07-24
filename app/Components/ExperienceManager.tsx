import React, { useState } from 'react';
import { Minigame } from './Minigame';
import { useStore } from '../store';

const ExperienceManager: React.FC = () => {
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const reset = useStore((state) => state.reset);

  const experiences = [
    { name: 'Experience 1', slides: ['default', 'set1', 'set1'] },
    { name: 'Experience 2', slides: ['set1', 'default', 'set1'] },
    // Add more experiences as needed
  ];

  const currentExperienceData = experiences[currentExperience];
  const totalSlides = currentExperienceData.slides.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      reset(currentExperienceData.slides[currentSlide + 1]);
    } else if (currentExperience < experiences.length - 1) {
      setCurrentExperience(currentExperience + 1);
      setCurrentSlide(0);
      reset(experiences[currentExperience + 1].slides[0]);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      reset(currentExperienceData.slides[currentSlide - 1]);
    } else if (currentExperience > 0) {
      setCurrentExperience(currentExperience - 1);
      const prevExperience = experiences[currentExperience - 1];
      setCurrentSlide(prevExperience.slides.length - 1);
      reset(prevExperience.slides[prevExperience.slides.length - 1]);
    }
  };
  return (
    <div>
      <Minigame page={experiences[currentExperience].slides[currentSlide]} />
      <div className="fixed bottom-4 right-4 space-x-2">
        <button
          onClick={goToPreviousSlide}
          disabled={currentExperience === 0 && currentSlide === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={goToNextSlide}
          disabled={currentExperience === experiences.length - 1 && currentSlide === totalSlides - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <div className="fixed top-4 left-4 text-white">
        Experience: {currentExperience + 1} / {experiences.length}, 
        Slide: {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default ExperienceManager;