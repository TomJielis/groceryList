import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

export default definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f0faf5',
      100: '#d9f2e5',
      200: '#b3e5cc',
      300: '#7dcfaa',
      400: '#5ebd8a',
      500: '#44a872',
      600: '#33895a',
      700: '#276946',
      800: '#1e5237',
      900: '#173d2a',
      950: '#0c2419',
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
          color:         '#5ebd8a',
          contrastColor: '#ffffff',
          hoverColor:    '#4aad78',
          activeColor:   '#3a9a66',
        },
        highlight: {
          background:      '#e8f5ee',
          focusBackground: '#d1edd9',
          color:           '#276946',
          focusColor:      '#1e5237',
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
        shadow: '0 0 0 3px rgba(28,43,43,0.12)',
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
        focusBorderColor: '#1c2b2b',
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
        focusBorderColor: '#1c2b2b',
        background:       '{surface.50}',
        borderRadius:     '4px',
      },
    },
    checkbox: {
      root: {
        borderColor:            '{surface.300}',
        checkedBackground:      '#1c2b2b',
        checkedBorderColor:     '#1c2b2b',
        checkedHoverBackground: '#152121',
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
