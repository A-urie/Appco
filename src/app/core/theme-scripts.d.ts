/**
 * Surface publique de `public/js/scripts.js`.
 *
 * Le fichier du template d'origine s'exécutait une seule fois via
 * `jQuery(function () { … })`. Il est désormais exposé sous forme d'API
 * idempotente, rejouée à chaque activation de la route d'accueil.
 */
interface AppCoTheme {
  /** (Ré)initialise les plugins jQuery du template sur le DOM courant. */
  init(): void;
}

interface Window {
  appcoTheme?: AppCoTheme;
}