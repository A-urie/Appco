import { Injectable } from '@angular/core';

/**
 * Scripts du template d'origine (jQuery + plugins).
 *
 * `jquery.countdown.min.js`, `wow.min.js`, `validator.min.js` et
 * `jquery.easing.min.js` ont été retirés : le template ne contenait ni `#clock`,
 * ni aucun élément porteur des classes `wow`, la validation des formulaires est
 * désormais assurée par les Reactive Forms Angular et le défilement vers les
 * ancres par le routeur.
 *
 * Isolé dans un service pour être neutralisable : les tests n'ont pas à charger
 * jQuery depuis le serveur de test.
 */
const SCRIPTS = [
  'js/jquery-3.6.1.min.js',
  'js/bootstrap.bundle.min.js',
  'js/jquery.magnific-popup.min.js',
  'js/owl.carousel.min.js',
  'js/scripts.js',
];

@Injectable({ providedIn: 'root' })
export class ThemeScriptLoader {
  /**
   * Le chargement est séquencé : chaque script dépend du précédent. Sans capture
   * de l'erreur, un seul script en échec suffisait à rejeter la promesse et à
   * laisser tous les suivants — dont `scripts.js` — non chargés, rendant la page
   * silencieusement inerte.
   *
   * L'initialisation des plugins est ensuite rejouée : elle est idempotente et le
   * DOM de la page d'accueil existe déjà à ce stade.
   */
  async load(): Promise<void> {
    try {
      for (const src of SCRIPTS) {
        await this.loadScript(src);
      }
      window.appcoTheme?.init();
    } catch (error) {
      console.error('[AppCo] Scripting du template interrompu :', error);
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Impossible de charger ' + src));
      document.body.appendChild(script);
    });
  }
}