/// <reference types="vite-plugin-pwa/react" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ReloadPrompt from './components/ReloadPrompt'

// Montamos la app en el div #root del index.html
const rootElement = document.getElementById('root')!
createRoot(rootElement).render(
  <StrictMode>
    <App />
    <ReloadPrompt />
  </StrictMode>
)
