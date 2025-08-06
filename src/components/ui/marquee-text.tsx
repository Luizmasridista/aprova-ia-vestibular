import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  className = '',
  speed = 30, // Default speed: 30 pixels per second
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [needsMarquee, setNeedsMarquee] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const animationId = useRef<number>();

  // Check if text overflows its container
  const checkOverflow = useCallback(() => {
    if (containerRef.current && textRef.current) {
      const newContainerWidth = containerRef.current.offsetWidth;
      const newTextWidth = textRef.current.scrollWidth;
      const isOverflowing = newTextWidth > newContainerWidth;
      
      // Only update state if values have actually changed to prevent ResizeObserver loops
      if (isOverflowing && (newTextWidth !== textWidth || newContainerWidth !== containerWidth)) {
        setTextWidth(newTextWidth);
        setContainerWidth(newContainerWidth);
      }
      
      // Only update needsMarquee if it has actually changed
      if (needsMarquee !== isOverflowing) {
        setNeedsMarquee(isOverflowing);
      }
    }
  }, [textWidth, containerWidth, needsMarquee]);

  // Handle animation frame
  const animate = useCallback(() => {
    if (!needsMarquee || isPaused || !textRef.current) {
      return;
    }

    const startTime = performance.now();
    const duration = (textWidth + containerWidth) / speed;
    const distance = textWidth - containerWidth;

    const step = (currentTime: number) => {
      if (isPaused) return;

      const elapsed = (currentTime - startTime) / 1000;
      const progress = (elapsed % duration) / duration;
      
      if (textRef.current) {
        const x = -progress * (textWidth + 20); // 20px gap between repeats
        textRef.current.style.transform = `translateX(${x}px)`;
      }

      animationId.current = requestAnimationFrame(step);
    };

    animationId.current = requestAnimationFrame(step);
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [needsMarquee, isPaused, textWidth, containerWidth, speed]);

  // Set up resize observer and initial check
  useEffect(() => {
    checkOverflow();
    
    let resizeTimeout: number;
    const debouncedCheckOverflow = () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(checkOverflow);
    };
    
    const resizeObserver = new ResizeObserver(debouncedCheckOverflow);
    const currentContainer = containerRef.current;
    
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
      resizeObserver.disconnect();
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [checkOverflow]);

  // Start/stop animation based on needsMarquee and isPaused
  useEffect(() => {
    if (needsMarquee && !isPaused) {
      animate();
    }
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [needsMarquee, isPaused, animate]);

  // Handle hover events if pauseOnHover is true
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        minWidth: 0, // Ensure flex container can shrink below content size
      }}
    >
      <div 
        className="inline-block whitespace-nowrap"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
        }}
      >
        <span 
          ref={textRef}
          className="inline-block whitespace-nowrap px-2"
          style={{
            display: 'inline-block',
            padding: '0 0.5rem',
            transition: 'transform 0.1s linear',
          }}
        >
          {text}
        </span>
        {needsMarquee && (
          <span 
            className="inline-block whitespace-nowrap px-2"
            aria-hidden="true"
            style={{
              display: 'inline-block',
              padding: '0 0.5rem',
              opacity: isPaused ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};
