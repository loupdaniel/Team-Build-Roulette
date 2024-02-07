// polyfills
import 'core-js/stable';
import 'web-animations-js/web-animations.min';
import 'element-remove-polyfill';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
 
inject();
injectSpeedInsights();
// styles
import '@styles/index.scss';

// main
import '@js/app';

// PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
