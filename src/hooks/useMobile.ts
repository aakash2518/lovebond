import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // For web deployment, always false
    setIsNative(false);
    
    // Check if device is mobile based on screen size and user agent
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMobileScreen = window.innerWidth <= 768;
      return isMobileDevice || isMobileScreen;
    };

    // Listen for window resize to detect virtual keyboard
    const handleResize = () => {
      if (checkMobile()) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const windowHeight = window.screen.height;
        const heightDiff = windowHeight - viewportHeight;
        
        if (heightDiff > 150) { // Keyboard likely open
          setIsKeyboardOpen(true);
          setKeyboardHeight(heightDiff);
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const hapticFeedback = async (style: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'MEDIUM') => {
    // Use web vibration API if available
    if ('vibrate' in navigator) {
      const duration = style === 'LIGHT' ? 50 : style === 'MEDIUM' ? 100 : 200;
      navigator.vibrate(duration);
    }
  };

  const hideKeyboard = async () => {
    // For web, blur active element to hide virtual keyboard
    if (document.activeElement && 'blur' in document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  };

  return {
    isNative,
    keyboardHeight,
    isKeyboardOpen,
    hapticFeedback,
    hideKeyboard,
    platform: 'web',
  };
};