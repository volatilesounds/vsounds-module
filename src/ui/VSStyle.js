export const VSStyle = {
  spacing: {
    edgeMedium: '10px',
    paddingMedium: '8px'
  },

  colors: {
    text: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },

  typography: {
    fontFamily: 'monospace',
    fontSizeSmall: '10px',
    fontSizeMedium: '14px'
  }
}

// compose styles after definition
VSStyle.panelBase = {
  position: 'absolute',
  color: VSStyle.colors.text,
  background: VSStyle.colors.overlay,
  padding: VSStyle.spacing.paddingMedium,
  fontFamily: VSStyle.typography.fontFamily,
  fontSize: VSStyle.typography.fontSizeSmall
}

VSStyle.buttonBase = {
  color: VSStyle.colors.text,
  background: VSStyle.colors.overlay,
  padding: VSStyle.spacing.paddingMedium,
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: VSStyle.typography.fontFamily,
  fontSize: VSStyle.typography.fontSizeSmall,
}