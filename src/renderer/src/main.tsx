import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      style={{ fontSize: '1rem ' }}
    >
      <App />
    </SnackbarProvider>
  </StrictMode>
)
