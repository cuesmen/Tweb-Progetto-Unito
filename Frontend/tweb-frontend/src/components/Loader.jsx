// components/Loader.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import '../css/loader.css';

export default function Loader({
  open = false,
  variant = 'overlay', // 'overlay' | 'inline'
  label = 'Loading',
  className = '',
}) {
  if (!open) return null;

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`loader-wrapper-container ${variant === 'overlay' ? 'loader-overlay' : ''} ${className}`}
    >
      <div className="main-container">
        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
          <div class="wheel"></div>
          <div class="hamster">
            <div class="hamster__body">
              <div class="hamster__head">
                <div class="hamster__ear"></div>
                <div class="hamster__eye"></div>
                <div class="hamster__nose"></div>
              </div>
              <div class="hamster__limb hamster__limb--fr"></div>
              <div class="hamster__limb hamster__limb--fl"></div>
              <div class="hamster__limb hamster__limb--br"></div>
              <div class="hamster__limb hamster__limb--bl"></div>
              <div class="hamster__tail"></div>
            </div>
          </div>
          <div class="spoke"></div>
        </div>
        <h1>Loading...</h1>
      </div>
    </div>
  );

  return variant === 'overlay' ? createPortal(content, document.body) : content;
}
