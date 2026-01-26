import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/stylesheets/index.css'
import './assets/stylesheets/film.css'
import './assets/stylesheets/components.css'
import './assets/stylesheets/home.css'
import './assets/stylesheets/homecarousel.css'
import './assets/stylesheets/actor.css'
import './assets/stylesheets/filmchat.css'
import './assets/stylesheets/filmreviews.css'
import './assets/stylesheets/oscarawards.css'
import './assets/stylesheets/footer.css'
import './assets/stylesheets/navbar.css'
import './assets/stylesheets/loader.css';
import 'flag-icons/css/flag-icons.min.css';
import AppRoutes from './navigation/Routes.jsx'
import { LoaderProvider } from './hooks/LoaderProvider.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <LoaderProvider>
      <AppRoutes />
    </LoaderProvider>
 // </StrictMode>,
)
