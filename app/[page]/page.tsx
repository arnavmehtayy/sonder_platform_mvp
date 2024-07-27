import ExperienceManager from '@/app/Components/ExperienceManager';
import { preventZoom } from '@/app/preventZoom';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    preventZoom();
  }, []);
  // document.body.style.overflow= "hidden"
  return (
    <main>
      <ExperienceManager />
    </main>
  );
}