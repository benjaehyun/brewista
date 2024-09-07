import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMediaQuery } from 'react-responsive';
import useStepDescriptionManager from './useStepDescriptionManager';
import MobileBottomSheet from './MobileBottomSheet';
import DescriptionModal from './DescriptionModal';

export default function AnimatedTimeline({ steps }) {
    const timelineRef = useRef(null);
    const { expandedStepIndex, expandStep, closeExpanded } = useStepDescriptionManager(steps);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const nodes = timelineRef.current.querySelectorAll('.timeline-node');
        const lines = timelineRef.current.querySelectorAll('.timeline-line');
        const texts = timelineRef.current.querySelectorAll('.timeline-text');
        const times = timelineRef.current.querySelectorAll('.timeline-time');
        const waterAmounts = timelineRef.current.querySelectorAll('.timeline-water-amount');
    
        // Animate nodes
        if (nodes.length > 0) {
            gsap.fromTo(
                nodes,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2 }
            );
        }
    
        // Animate lines
        if (lines.length > 0) {
            gsap.fromTo(
                lines,
                { scaleY: 0 },
                { scaleY: 1, duration: 0.5, stagger: 0.2, delay: 0.1 }
            );
        }
    
        // Animate text
        if (texts.length > 0) {
            gsap.fromTo(
                texts,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, delay: 0.3 }
            );
        }
    
        // Animate time displays
        if (times.length > 0) {
            gsap.fromTo(
                times,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, delay: 0.3 }
            );
        }
    
        // Animate water amounts
        if (waterAmounts.length > 0) {
            gsap.fromTo(
                waterAmounts,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, delay: 0.3 }
            );
        }
    }, [steps]);
    

    

    // Configuration for line lengths
    const MIN_LINE_HEIGHT = 50; // in pixels
    const MAX_LINE_HEIGHT = 150; // in pixels
    const DEFAULT_LINE_HEIGHT = 80; // in pixels when time is undefined
    const LINE_THICKNESS = 4; // Increase thickness

    // Extract times from steps
    const times = steps.map((step) => step.time).filter((time) => time !== undefined);

    // Determine scaling factor
    const maxTime = times.length > 0 ? Math.max(...times) : 0;

    // Function to calculate line height
    const calculateLineHeight = (time) => {
        if (time === undefined || maxTime === 0) return DEFAULT_LINE_HEIGHT;
        const scaledHeight = (time / maxTime) * MAX_LINE_HEIGHT;
        return Math.max(MIN_LINE_HEIGHT, scaledHeight);
    };

    return (
        <div ref={timelineRef} className="relative mx-auto w-full flex flex-col items-center">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="relative flex items-center">
                        {/* Water Amount (if applicable) */}
                        {step.waterAmount !== undefined && (
                            <p className="timeline-water-amount absolute right-8 text-xs text-gray-600 whitespace-nowrap">
                                {`${step.waterAmount} mL`}
                            </p>
                        )}

                        {/* Step Node */}
                        <div className="timeline-node w-6 h-6 rounded-full bg-blue-500"></div>

                        {/* Description Text */}
                        {/* <p className="timeline-text absolute left-8 text-left text-sm text-gray-800 p-2 bg-blue-100 rounded-lg shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-44 sm:max-w-max">
                            {step.description}
                        </p> */}
                        <p 
                            className="timeline-text absolute left-8 text-left text-sm text-gray-800 p-2 bg-blue-100 rounded-lg shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-44 sm:max-w-max cursor-pointer"
                            onClick={() => expandStep(index)}
                        >
                            {step.description}
                        </p>
                    </div>

                    <div className="relative flex items-center my-4">
                        {/* Line after Step Node */}
                        <div
                            className="timeline-line"
                            style={{
                                height: `${calculateLineHeight(step.time)}px`,
                                width: `${LINE_THICKNESS}px`,
                                backgroundColor: 'rgba(59, 130, 246, 1)',
                            }}
                        ></div>

                        {/* Time Display (if applicable) */}
                        {step.time !== undefined && (
                            <p className="timeline-time absolute left-8 text-xs text-gray-600 whitespace-nowrap">
                                {`${step.time} sec`}
                            </p>
                        )}
                    </div>
                </div>
            ))}

            {/* Final Node */}
            <div className="flex flex-col items-center">
                <div className="relative flex items-center">
                    <div className="timeline-node w-6 h-6 rounded-full bg-green-500"></div>

                    {/* Final Node Text */}
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
}
