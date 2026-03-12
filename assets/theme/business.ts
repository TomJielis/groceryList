import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

export default definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          color:         '#f97316',
          contrastColor: '#ffffff',
          hoverColor:    '#ea580c',
          activeColor:   '#c2410c',
        },
        highlight: {
          background:      '#fff7ed',
          focusBackground: '#ffedd5',
          color:           '#c2410c',
          focusColor:      '#9a3412',
        },
      },
    },
    formField: {
      borderRadius: '4px',
      focusRing: {
        width:  '0',
        style:  'none',
        color:  'transparent',
        offset: '0',
        shadow: '0 0 0 3px rgba(30,58,95,0.12)',
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '4px',
        paddingX:     '1rem',
        paddingY:     '0.6rem',
        sm: {
          fontSize: '0.75rem',
          paddingX: '0.75rem',
          paddingY: '0.45rem',
        },
      },
    },
    inputtext: {
      root: {
        borderColor:      '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#1e3a5f',
        background:       '{surface.50}',
        color:            '{surface.900}',
        placeholderColor: '{surface.400}',
        borderRadius:     '4px',
      },
    },
    select: {
      root: {
        borderColor:      '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#1e3a5f',
        background:       '{surface.50}',
        borderRadius:     '4px',
      },
    },
    checkbox: {
      root: {
        borderColor:            '{surface.300}',
        checkedBackground:      '#1e3a5f',
        checkedBorderColor:     '#1e3a5f',
        checkedHoverBackground: '#16304f',
        borderRadius:           '3px',
      },
      icon: {
        checkedColor: '#ffffff',
      },
    },
    card: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
    dialog: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
    progressbar: {
      root: {
        background:   '{surface.200}',
        borderRadius: '2px',
        height:       '4px',
      },
      value: {
        background: '{primary.color}',
      },
    },
    datatable: {
      headerCell: {
        background:  '{surface.50}',
        color:       '{surface.500}',
        borderColor: '{surface.200}',
      },
      row: {
        background:      '{surface.0}',
        hoverBackground: '{surface.50}',
        borderColor:     '{surface.100}',
      },
      bodyCell: {
        borderColor: '{surface.100}',
      },
    },
  },
})
