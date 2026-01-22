export const VSStyle = {
  sizing: {
    // For padding inside elements
    paddingSmall: '4px',
    paddingMedium: '8px',
    paddingLarge: '12px',
    
    // For spacing between elements, flex/grid gaps, margins
    spacingSmall: '4px',
    spacingMedium: '8px',
    spacingLarge: '12px',
    
    // For offsets from edges of a container / screen
    edgeSmall: '4px',
    edgeMedium: '10px',
    edgeLarge: '20px'
  },

  colors: {
    text: '#ebebeb',
    overlay: 'rgba(0, 0, 0, 0.5)',
    slider: 'rgba(12, 23, 0, 1)'
  },

  typography: {
    fontFamily: 'monospace',
    fontSizeSmall: '10px',
    fontSizeMedium: '14px'
  },

  ui: {
    zIndex: '1000'
  }
}

// compose styles after definition
VSStyle.panelBase = {
  color: VSStyle.colors.text,
  background: VSStyle.colors.overlay,
  padding: VSStyle.sizing.paddingMedium,
  fontFamily: VSStyle.typography.fontFamily,
  fontSize: VSStyle.typography.fontSizeSmall,
  zIndex: VSStyle.ui.zIndex
}

VSStyle.buttonBase = {
  color: VSStyle.colors.text,
  background: VSStyle.colors.overlay,
  padding: VSStyle.sizing.paddingMedium,
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: VSStyle.typography.fontFamily,
  fontSize: VSStyle.typography.fontSizeSmall,
  pointerEvents: "auto",
  zIndex: VSStyle.ui.zIndex
}