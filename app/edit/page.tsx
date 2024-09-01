'use client'

import { Minigame } from '@/app/Components/Sidebar/Minigame';
import CurvedBackButton from '@/app/Components/three/BackButton';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import {EditBar} from '@/app/Components/MainMenu/EditBar';
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