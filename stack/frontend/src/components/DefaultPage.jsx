import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLoader } from '../hooks/LoaderProvider';

export default function DefaultPage({
  children,
  className = '',
  loading = false,
  loadingMessage = '',
  minShowMs = 500,
  delayMs = 0,
}) {
  const { show, hide } = useLoader();
  const showT = useRef(null);
  const hideT = useRef(null);

  const shownAt = useRef(0);
  const hasShown = useRef(false);
  const lastMsg = useRef('');

  useEffect(() => {
    if (showT.current) { clearTimeout(showT.current); showT.current = null; }
    if (hideT.current) { clearTimeout(hideT.current); hideT.current = null; }

    if (loading) {
      showT.current = setTimeout(() => {
        if (lastMsg.current !== loadingMessage) {
          show(loadingMessage);
          lastMsg.current = loadingMessage;
        } else {
          show();
        }
        shownAt.current = Date.now();
        hasShown.current = true;
        showT.current = null;
      }, Math.max(0, delayMs));
    } else {
      if (!hasShown.current) {
        hide(); 
      } else {
        const elapsed = Date.now() - shownAt.current;
        const wait = Math.max(0, (minShowMs || 0) - elapsed);
        hideT.current = setTimeout(() => {
          hide();
          hideT.current = null;
          lastMsg.current = '';
          hasShown.current = false;
          shownAt.current = 0;
        }, wait);
      }
    }

    return () => {
      if (showT.current) { clearTimeout(showT.current); showT.current = null; }
      if (hideT.current) { clearTimeout(hideT.current); hideT.current = null; }
    };
  }, [loading, loadingMessage, minShowMs, delayMs, show, hide]);

  return <div className={`default-page ${className}`}>{children}</div>;
}

DefaultPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  minShowMs: PropTypes.number, 
  delayMs: PropTypes.number,  
};
