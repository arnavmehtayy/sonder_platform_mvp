'use client'

import CurvedBackButton from '@/app/Components/three/BackButton';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import { EditBar } from '../Components/EditMode/EditBar';
import { MinigameEdit } from '../Components/Sidebar/MiniGameEdit';

export default function EditMode() {
    return (
        <>
        <EditBar />
        <div className="flex flex-col h-screen">
            
          
          <div className="flex-grow">
            <CurvedBackButton />
            <MinigameEdit />
            <FeedbackComponent />
            
          </div>
          {/* {Number(slideIndex) == 0 && <TutorialOverlay onComplete={() => 1 + 1} />} */}
        </div>
        </>
        
      );
}