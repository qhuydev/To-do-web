import { createTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOTTOM_BAR_HEIGHT = '120px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT} - ${BOTTOM_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = createTheme({
  // ⚙ Custom layout values
  todo: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    bottomBarHeight: BOTTOM_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },


  // ⚡ Color schemes
  colorSchemes: {
    light: {},
    dark: {},
  },
  colorScheme: 'light',           // default
  colorSchemeSelector: 'class',   // để setMode hoạt động

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': { width: '8px', height: '8px' },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px',
          },
          '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'white' },
        },
      },
    },

    MuiInputLabel: { styleOverrides: { root: { fontSize: '0.875rem' } } },
    MuiTypography: {
      styleOverrides: { root: { '&.MuiTypography-body1': { fontSize: '0.875rem' } } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '0.5px !important' },
        },
      },
    },
  },
})

export default theme
