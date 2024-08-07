import React from 'react';
import ShowScore from './ShowScore';
import ShowControl from './ShowControl';
import ShowPlacement from './ShowPlacement';
import Latex from 'react-latex-next';
import { initDataSets } from '@/classes/init_datasets';

// Define types for our components
export type ComponentType = 'score' | 'control' | 'placement' | 'question';

export interface OrderItem {
  type: ComponentType;
  id:  number;
}

interface OrderHandlerProps {
  state_name: keyof typeof initDataSets;
}

export const OrderHandler: React.FC<OrderHandlerProps> = ({ state_name}) => {
    const questions = initDataSets[state_name].questions;
    const order = initDataSets[state_name].order;
    const title = initDataSets[state_name].title;
  const renderComponent = (item: OrderItem) => {
    switch (item.type) {
      case 'score':
        return <ShowScore key={`score-${item.id}`} score_id={item.id as number} />;
      case 'control':
        return <ShowControl key={`control-${item.id}`} control_id={item.id as number} />;
      case 'placement':
        return <ShowPlacement key="placement" />;
      case 'question':
        return (
          <div key={`question-${item.id}`} className="p-4">
            {item.id == 0 ? <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">{title}</h2> : null}
            <p id={`question-text-${item.id}`} className="text-gray-700">
              {item.id < questions.length ? <Latex>{questions[item.id as number]}</Latex> : null}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {order.map((item) => renderComponent(item))}
    </div>
  );
};
