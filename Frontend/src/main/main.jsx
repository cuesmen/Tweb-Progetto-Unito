import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/index.css'
import '../css/film.css'
import '../css/components.css'
import '../css/home.css'
import '../css/actor.css'
import 'flag-icons/css/flag-icons.min.css';
import AppRoutes from '../navigation/Routes.jsx'
import { LoaderProvider } from '../hooks/LoaderProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <AppRoutes />
    </LoaderProvider>
  </StrictMode>,
)
