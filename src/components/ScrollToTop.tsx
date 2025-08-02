import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const isAiChatActive = useRef(false);

  useEffect(() => {
    // Listen for AI chat interactions to prevent scroll interference
    const handleAiChatStart = () => {
      isAiChatActive.current = true;
    };

    const handleAiChatEnd = () => {
      // Allow scrolling again after a short delay to ensure conversation flow
      setTimeout(() => {
        isAiChatActive.current = false;
      }, 2000);
    };

    // Listen for AI chat widget events
    window.addEventListener('ai-chat-start', handleAiChatStart);
    window.addEventListener('ai-chat-message-sent', handleAiChatStart);
    window.addEventListener('ai-chat-end', handleAiChatEnd);

    return () => {
      window.removeEventListener('ai-chat-start', handleAiChatStart);
      window.removeEventListener('ai-chat-message-sent', handleAiChatStart);
      window.removeEventListener('ai-chat-end', handleAiChatEnd);
    };
  }, []);

  useEffect(() => {
    // Only scroll to top if AI chat is not active and it's a pathname change (not hash)
    if (!isAiChatActive.current && !location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;