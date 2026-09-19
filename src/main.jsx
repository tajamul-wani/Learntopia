import { createRoot } from 'react-dom/client'
import './fonts.js'
import './index.css'
import App from './App.jsx'
import { initMonitoring } from './lib/monitoring.js'
import { installDomGuards } from './lib/domGuards.js'

// Guard against extension/translation DOM mutation crashing React. Must run
// before React mounts so the patched methods are in place from the first render.
installDomGuards()

// Start error monitoring as early as possible. No-op unless VITE_SENTRY_DSN is
// set in a production build, so this is safe in dev and DSN-less deploys.
initMonitoring()

createRoot(document.getElementById('root')).render(
    <App />
)
