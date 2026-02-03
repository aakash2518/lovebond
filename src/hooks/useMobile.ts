import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    // Only setup mobile features if on native platform
    if (Capacitor.isNativePlatform()) {
      setupMobileFeatures();
    }
  }, []);

  const setupMobileFeatures = async () => {
    try {
      // Dynamic imports for mobile plugins
      const { StatusBar } = await import('@capacitor/status-bar');
      const { Keyboard } = await import('@capacitor/keyboard');
      
      // Configure status bar
      await StatusBar.setStyle({ style: 'DARK' });
      await StatusBar.setBackgroundColor({ color: '#0a0a1a' });

      // Keyboard listeners
      const keyboardWillShow = await Keyboard.addListener('keyboardWillShow', (info: any) => {
        setKeyboardHeight(info.keyboardHeight);
        setIsKeyboardOpen(true);
      });

      const keyboardWillHide = await Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      });

      // Cleanup function
      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    } catch (error) {
      console.log('Mobile plugins not available:', error);
    }
  };

  const hapticFeedback = async (style: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'MEDIUM') => {
    if (Capacitor.isNativePlatform()) {
      try {
        const { Haptics } = await import('@capacitor/haptics');
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };

  const hideKeyboard = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const { Keyboard } = await import('@capacitor/keyboard');
        await Keyboard.hide();
      } catch (error) {
        console.log('Keyboard not available:', error);
      }
    }
  };

  return {
    isNative,
    keyboardHeight,
    isKeyboardOpen,
    hapticFeedback,
    hideKeyboard,
    platform: Capacitor.getPlatform(),
  };
};