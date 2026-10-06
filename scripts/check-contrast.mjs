// scripts/check-contrast.mjs
// Automated WCAG contrast checker for theme tokens without external dependencies.

function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
}

function getLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const tokens = {
  dark: {
    'bg-main': '#0B0F1A',
    'bg-surface': '#121829',
    'bg-elevated': '#1A2238',
    'bg-hero': '#0B0F1A',
    'border': '#596C98',
    'text-main': '#F4F6FB',
    'text-muted': '#A3AEC9',
    'accent': '#FFB800',
    'on-accent': '#0B0F1A',
    'accent-text': '#FFB800',
    'good': '#2DD4BF',
    'warn': '#FFB800',
    'warn-text': '#FFB800',
    'warn-ring': '#FFB800',
    'bad': '#FF5C5C',
    'ring-track': '#263049',
    'focus': '#FFB800'
  },
  light: {
    'bg-main': '#FFF8EF',
    'bg-surface': '#FFFFFF',
    'bg-elevated': '#FFF1DC',
    'bg-hero': '#FFEFD6',
    'border': '#9B7440',
    'text-main': '#1B1410',
    'text-muted': '#5E5247',
    'accent': '#FFB800',
    'on-accent': '#1B1410',
    'accent-text': '#A24B05',
    'good': '#0F766E',
    'warn': '#A24B05',
    'warn-text': '#A24B05',
    'warn-ring': '#D97706',
    'bad': '#C62828',
    'ring-track': '#F0DDBF',
    'focus': '#A24B05'
  }
};

let failed = false;

console.log('====================================================');
console.log('  WCAG CONTRAST RATIO VERIFICATION (check-contrast)');
console.log('====================================================\n');

for (const [theme, t] of Object.entries(tokens)) {
  console.log(`--- THEME: ${theme.toUpperCase()} ---`);

  const tests = [
    // Text tests (need >= 4.5:1)
    { name: 'text-main on bg-main', fg: t['text-main'], bg: t['bg-main'], minRatio: 4.5 },
    { name: 'text-main on bg-surface', fg: t['text-main'], bg: t['bg-surface'], minRatio: 4.5 },
    { name: 'text-main on bg-hero', fg: t['text-main'], bg: t['bg-hero'], minRatio: 4.5 },
    { name: 'text-muted on bg-main', fg: t['text-muted'], bg: t['bg-main'], minRatio: 4.5 },
    { name: 'text-muted on bg-surface', fg: t['text-muted'], bg: t['bg-surface'], minRatio: 4.5 },
    { name: 'text-muted on bg-hero', fg: t['text-muted'], bg: t['bg-hero'], minRatio: 4.5 },
    { name: 'accent-text on bg-main', fg: t['accent-text'], bg: t['bg-main'], minRatio: 4.5 },
    { name: 'accent-text on bg-hero', fg: t['accent-text'], bg: t['bg-hero'], minRatio: 4.5 },
    { name: 'on-accent on accent', fg: t['on-accent'], bg: t['accent'], minRatio: 4.5 },
    { name: 'good (text) on bg-surface', fg: t['good'], bg: t['bg-surface'], minRatio: 4.5 },
    { name: 'warn-text on bg-surface', fg: t['warn-text'], bg: t['bg-surface'], minRatio: 4.5 },
    { name: 'bad (text) on bg-surface', fg: t['bad'], bg: t['bg-surface'], minRatio: 4.5 },

    // UI Component / Graphic tests (need >= 3.0:1)
    { name: 'good (ring) vs bg-surface', fg: t['good'], bg: t['bg-surface'], minRatio: 3.0 },
    { name: 'warn-ring vs bg-surface', fg: t['warn-ring'], bg: t['bg-surface'], minRatio: 3.0 },
    { name: 'bad (ring) vs bg-surface', fg: t['bad'], bg: t['bg-surface'], minRatio: 3.0 },
    { name: 'border vs bg-surface', fg: t['border'], bg: t['bg-surface'], minRatio: 3.0 },
    { name: 'focus vs bg-surface', fg: t['focus'], bg: t['bg-surface'], minRatio: 3.0 },
  ];

  for (const test of tests) {
    const ratio = getContrastRatio(test.fg, test.bg);
    const pass = ratio >= test.minRatio;
    const formattedRatio = ratio.toFixed(2) + ':1';
    
    if (pass) {
      console.log(`  ✓ PASS: ${test.name.padEnd(32)} | Ratio: ${formattedRatio.padStart(7)} (Required: ${test.minRatio}:1)`);
    } else {
      console.error(`  ❌ FAIL: ${test.name.padEnd(32)} | Ratio: ${formattedRatio.padStart(7)} (Required: ${test.minRatio}:1) [FG: ${test.fg}, BG: ${test.bg}]`);
      failed = true;
    }
  }
  console.log('');
}

if (failed) {
  console.error('❌ Contrast check failed! One or more tokens do not satisfy WCAG AA ratio standards.');
  process.exit(1);
} else {
  console.log('✅ ALL CONTRAST RATIO TESTS PASSED CLEANLY (WCAG 2.2 AA).');
}
