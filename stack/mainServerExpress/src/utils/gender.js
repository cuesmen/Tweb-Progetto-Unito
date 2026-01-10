/**
 * Gender helpers.
 * @module gender
 * @category Utils
 */

/**
 * Maps numeric gender codes to human-readable text.
 * @param {number|string|null} g Gender code (1=female, 2=male).
 * @returns {string|null} Text label or null when unknown.
 */
export function genderTextOf(g) {
    if (g === 1 || g === '1') return 'Female';
    if (g === 2 || g === '2') return 'Male';
    return null;
  }
  
