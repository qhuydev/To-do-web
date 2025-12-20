import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { CssVarsProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'  // thêm dòng này
import theme from '~/theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={3000}
      >
        <App />
      </SnackbarProvider>
    </CssVarsProvider>
  </React.StrictMode>
)
