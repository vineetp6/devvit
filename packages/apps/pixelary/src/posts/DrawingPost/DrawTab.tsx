import { Devvit, useState } from '@devvit/public-api';

import type { PostData } from '../../types/PostData.js';
import { DrawTabEditorStep } from './DrawTabEditorStep.js';
import { DrawTabOverviewStep } from './DrawTabOverviewStep.js';
import { DrawTabReviewStep } from './DrawTabReviewStep.js';
import { DrawTabWordStep } from './DrawTabWordStep.js';

interface DrawTabProps {
  data: {
    username: string | null;
    activeFlairId: string | undefined;
    currentDictionary: string[];
  };
  myDrawings: PostData[] | null;
  myDrawingsLoading: boolean;
  onDrawingSubmitted: () => void;
  setShowTabs: (showTabs: boolean) => void;
}

export const DrawTab = (props: DrawTabProps): JSX.Element => {
  const defaultStep = 'Overview';
  const [currentStep, setCurrentStep] = useState<string>(defaultStep);
  const [word, setWord] = useState<string>('');
  const [drawing, setDrawing] = useState<number[]>([]);

  const steps: Record<string, JSX.Element> = {
    Overview: (
      <DrawTabOverviewStep
        {...props}
        onNext={() => {
          setCurrentStep('Word');
          props.setShowTabs(false);
        }}
      />
    ),
    Word: (
      <DrawTabWordStep
        {...props}
        onNext={(word) => {
          setWord(word);
          setCurrentStep('Editor');
        }}
        currentDictionary={props.data.currentDictionary}
      />
    ),
    Editor: (
      <DrawTabEditorStep
        {...props}
        word={word}
        onNext={(drawing) => {
          setDrawing(drawing);
          setCurrentStep('Review');
        }}
      />
    ),
    Review: (
      <DrawTabReviewStep
        {...props}
        word={word}
        drawing={drawing}
        onNext={() => {
          props.onDrawingSubmitted();
          setCurrentStep('Overview');
          props.setShowTabs(true);
        }}
      />
    ),
  };

  return (
    <vstack width="100%" grow>
      {steps[currentStep] || <text>Error: Step not found in draw tab</text>}
    </vstack>
  );
};
