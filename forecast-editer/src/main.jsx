import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ToggleContext.jsx'
import { ForecastProvider } from './context/ForecastContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ForecastProvider>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  </ForecastProvider>
)
