import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLoader } from '../hooks/LoaderProvider';

export default function DefaultPage({
  children,
  className = '',
  loadingMessage = '',
  autoHideMs = 500,
  showOnMount = true,
}) {
  const { show, hide } = useLoader();
  const tRef = useRef(null);

  useEffect(() => {
    if (!showOnMount) return;

    show(loadingMessage);

    if (typeof autoHideMs === 'number') {
      tRef.current = setTimeout(() => {
        hide();
        tRef.current = null;
      }, autoHideMs);
    }

    return () => {
      if (tRef.current) {
        clearTimeout(tRef.current);
        tRef.current = null;
      }
      hide();
    };
  }, [showOnMount, show, hide, autoHideMs, loadingMessage]);

  return <div className={`default-page ${className}`}>{children}</div>;
}

DefaultPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  loadingMessage: PropTypes.string,
  autoHideMs: PropTypes.number, 
  showOnMount: PropTypes.bool,
};
