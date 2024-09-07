import { useState } from 'react';

const useStepDescriptionManager = (steps) => {
  const [expandedStepIndex, setExpandedStepIndex] = useState(null);

  const expandStep = (index) => {
    setExpandedStepIndex(index);
  };

  const closeExpanded = () => {
    setExpandedStepIndex(null);
  };

  return { expandedStepIndex, expandStep, closeExpanded };
};

export default useStepDescriptionManager;