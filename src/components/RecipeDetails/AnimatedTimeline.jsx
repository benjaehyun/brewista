import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ScaledTimeline({ steps }) {
    const timelineRef = useRef(null);

    useEffect(() => {
        const nodes = timelineRef.current.querySelectorAll('.timeline-node');
        const lines = timelineRef.current.querySelectorAll('.timeline-line');

        gsap.fromTo(
            nodes,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2 }
        );

        gsap.fromTo(
            lines,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.5, stagger: 0.2, delay: 0.1 }
        );
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
        <div ref={timelineRef} className="relative mx-auto w-10 flex flex-col items-center">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* Step Node */}
                    <div className="timeline-node w-6 h-6 rounded-full bg-blue-500"></div>

                    {/* Description Text */}
                    <p className="text-center text-sm text-gray-700 mt-2 mb-4 max-w-xs">
                        {step.description}
                    </p>

                    {/* Line after Step Node */}
                    <div
                        className="timeline-line"
                        style={{
                            height: `${calculateLineHeight(step.time)}px`,
                            width: `${LINE_THICKNESS}px`,
                            backgroundColor: 'rgba(59, 130, 246, 1)', // Match the color of nodes (Tailwind's blue-500)
                        }}
                    ></div>
                </div>
            ))}

            {/* Final Node */}
            <div className="flex flex-col items-center">
                <div className="timeline-node w-6 h-6 rounded-full bg-green-500"></div>

                {/* Final Node Text */}
                <p className="text-center text-sm text-gray-700 mt-2 max-w-xs">
                    Enjoy your coffee!
                </p>
            </div>
        </div>
    );
}
