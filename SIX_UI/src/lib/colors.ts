/**
 * SIX Brand Color Palette
 * Official color scheme for the SIX UI design system.
 */

export const SIX_COLORS = {
  /** Deep red — primary brand color, used for CTAs, key highlights */
  primary: '#D92525',
  /** Medium red — secondary interactions, hover states */
  primaryLight: '#D94A4A',
  /** Soft red — accents, borders, secondary elements */
  secondary: '#F26D6D',
  /** Pale red — backgrounds, subtle fills, disabled states */
  tertiary: '#F2A0A0',
  /** Off-white / light neutral — backgrounds, cards, surfaces */
  neutral: '#F2F2F2',
} as const

export type SixColorKey = keyof typeof SIX_COLORS
export type SixColorValue = (typeof SIX_COLORS)[SixColorKey]

/**
 * Tailwind class mapping for SIX brand colors.
 * Use these when constructing dynamic class names.
 */
export const SIX_TAILWIND = {
  primary: {
    bg: 'bg-six-primary',
    text: 'text-six-primary',
    border: 'border-six-primary',
    hover: 'hover:bg-six-primary',
  },
  primaryLight: {
    bg: 'bg-six-primary-light',
    text: 'text-six-primary-light',
    border: 'border-six-primary-light',
    hover: 'hover:bg-six-primary-light',
  },
  secondary: {
    bg: 'bg-six-secondary',
    text: 'text-six-secondary',
    border: 'border-six-secondary',
    hover: 'hover:bg-six-secondary',
  },
  tertiary: {
    bg: 'bg-six-tertiary',
    text: 'text-six-tertiary',
    border: 'border-six-tertiary',
    hover: 'hover:bg-six-tertiary',
  },
  neutral: {
    bg: 'bg-six-neutral',
    text: 'text-six-neutral',
    border: 'border-six-neutral',
    hover: 'hover:bg-six-neutral',
  },
} as const
