import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const RollingText = ({ 
  text = "CUSTOM TEXT", 
  speed = 0.05, 
  duration = 1000,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?\'"';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Split text into words to prevent word breaking
  const words = text.split(' ');

  return (
    <div 
      ref={containerRef}
      className={`rolling-text ${className}`}
      style={{
        display: 'flex',
        gap: '0.5em',
        fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1.4,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {words.map((word, wordIndex) => {
        const wordStartIndex = words.slice(0, wordIndex).join(' ').length + wordIndex;
        return (
          <div key={wordIndex} style={{ display: 'flex', gap: '0.05em' }}>
            {word.split('').map((char, charIndex) => (
              <RollingChar
                key={charIndex}
                targetChar={char}
                isVisible={isVisible}
                delay={(wordStartIndex + charIndex) * speed}
                duration={duration}
                chars={chars}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const RollingChar = ({ targetChar, isVisible, delay, duration, chars }) => {
  const [displayChar, setDisplayChar] = useState(targetChar);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible) {
      hasAnimated.current = false;
      setDisplayChar(targetChar);
      setIsAnimating(false);
      return;
    }

    if (hasAnimated.current || isAnimating) return;

    const timeout = setTimeout(() => {
      setIsAnimating(true);
      hasAnimated.current = true;

      const steps = 15;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep < steps) {
          // Show random characters
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          setDisplayChar(randomChar);
        } else {
          // Final character
          setDisplayChar(targetChar);
          setIsAnimating(false);
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isVisible, targetChar, delay, duration, chars, isAnimating]);

  return (
    <motion.span
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isAnimating ? 0.6 : 1 }}
      style={{
        display: 'inline-block',
        minWidth: '0.4em',
        textAlign: 'center',
        color: isAnimating ? '#6b7280' : '#e5e7eb',
        transition: 'color 0.2s ease',
      }}
    >
      {displayChar}
    </motion.span>
  );
};

export { RollingText };
