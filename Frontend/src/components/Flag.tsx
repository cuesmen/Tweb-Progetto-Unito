import React from 'react';

function ccToEmoji(cc) {
  return cc
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function getRegionLabel(code, title) {
  if (title) return title;
  const cc = (code || '').toUpperCase();
  try {
    const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
    const dn = new Intl.DisplayNames([lang], { type: 'region' });
    return dn.of(cc) || cc;
  } catch {
    return cc;
  }
}

function Flag({
  code,
  decorative = false,
  title,
  className,
  emojiFallback = false,
}) {
  const regionLabel = getRegionLabel(code, title);

  if (emojiFallback) {
    return (
      <span
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `Bandiera ${regionLabel}`}
        aria-hidden={decorative ? true : undefined}
        className={className}
        title={regionLabel}
        style={{ fontSize: '1em', lineHeight: 1, verticalAlign: '-2px' }}
      >
        {ccToEmoji(code)}
      </span>
    );
  }

  const classes = ['fi', `fi-${String(code).toLowerCase()}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `Bandiera ${regionLabel}`}
      title={regionLabel}
      style={{
        width: '1.2em',
        height: '1.2em',
        verticalAlign: '-2px',
        display: 'inline-block',
      }}
    />
  );
}

export default Flag;
