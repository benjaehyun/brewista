import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { useMediaQuery } from 'react-responsive';
import useStepDescriptionManager from './useStepDescriptionManager';
import MobileBottomSheet from './MobileBottomSheet';
import DescriptionModal from './DescriptionModal';

const AnimatedTimeline = React.memo(function AnimatedTimeline({ steps }) {
    const timelineRef = useRef(null);
    const animationRef = useRef(null);
    const { expandedStepIndex, expandStep, closeExpanded } = useStepDescriptionManager(steps);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const animateElements = useCallback(() => {
        const elements = {
            nodes: timelineRef.current.querySelectorAll('.timeline-node'),
            lines: timelineRef.current.querySelectorAll('.timeline-line'),
            texts: timelineRef.current.querySelectorAll('.timeline-text'),
            times: timelineRef.current.querySelectorAll('.timeline-time'),
            waterAmounts: timelineRef.current.querySelectorAll('.timeline-water-amount')
        };

        animationRef.current = gsap.timeline();

        Object.entries(elements).forEach(([key, elements]) => {
            if (elements.length > 0) {
                animationRef.current.fromTo(
                    elements,
                    { opacity: 0, x: key.includes('Amount') ? 20 : -20 },
                    { opacity: 1, x: 0, duration: 0.4},
                    key === 'nodes' ? '0' : '-=0.3'
                );
            }
        });
    }, []);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.kill();
        }
        animateElements();

        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, [steps, animateElements]);

    const calculateLineHeight = useCallback((time) => {
        const MIN_LINE_HEIGHT = 50;
        const MAX_LINE_HEIGHT = 150;
        const DEFAULT_LINE_HEIGHT = 80;
        const maxTime = Math.max(...steps.map(step => step.time).filter(Boolean), 0);
        
        if (time === undefined || maxTime === 0) return DEFAULT_LINE_HEIGHT;
        const scaledHeight = (time / maxTime) * MAX_LINE_HEIGHT;
        return Math.max(MIN_LINE_HEIGHT, scaledHeight);
    }, [steps]);

    const renderedSteps = useMemo(() => steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
            <div className="relative flex items-center">
                {step.waterAmount !== undefined && (
                    <p className="timeline-water-amount absolute right-8 text-xs text-gray-600 whitespace-nowrap">
                        {`${step.waterAmount} mL`}
                    </p>
                )}
                <div className="timeline-node w-6 h-6 rounded-full bg-blue-500"></div>
                <p 
                    className="timeline-text absolute left-8 text-left text-sm text-gray-800 p-2 bg-blue-100 rounded-lg shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-44 sm:max-w-max cursor-pointer"
                    onClick={() => expandStep(index)}
                >
                    {step.description}
                </p>
            </div>
            <div className="relative flex items-center my-4">
                <div
                className="timeline-line"
                style={{
                    height: `${calculateLineHeight(step.time)}px`,
                    width: '4px',
                    backgroundColor: 'rgba(59, 130, 246, 1)',
                }}
                >                    
                </div>
                {step.time !== undefined && (
                    <p className="timeline-time absolute left-8 text-xs text-gray-600 whitespace-nowrap">
                        {`${step.time} sec`}
                    </p>
                )}
            </div>
        </div>
    )), [steps, calculateLineHeight, expandStep]);

    return (
        <div ref={timelineRef} className="relative mx-auto w-full flex flex-col items-center">
            {renderedSteps}
            <div className="flex flex-col items-center">
                <div className="relative flex items-center">
                    <div className="timeline-node w-6 h-6 rounded-full bg-green-500"></div>
                    <p className="timeline-text absolute left-8 text-left text-sm text-gray-800 mt-2 max-w-xs p-2 bg-green-100 rounded-lg shadow whitespace-nowrap overflow-hidden text-ellipsis">
                        Enjoy your coffee!
                    </p>
                </div>
            </div>
            {expandedStepIndex !== null && (
                isMobile ? (
                    <MobileBottomSheet
                        step={steps[expandedStepIndex]}
                        onClose={closeExpanded}
                    />
                ) : (
                    <DescriptionModal
                        step={steps[expandedStepIndex]}
                        onClose={closeExpanded}
                    />
                )
            )}
        </div>
    );
});

export default AnimatedTimeline;