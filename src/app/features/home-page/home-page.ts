import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactSection } from '../../shared/components/contact-section/contact-section';
import { NewsletterForm } from '../../shared/components/newsletter-form/newsletter-form';

/**
 * Page d'accueil : l'ensemble des sections de la landing page.
 *
 * Les plugins jQuery du template (Owl Carousel, Magnific Popup) sont initialisés
 * par `window.appcoTheme.init()` : leur DOM étant recréé à chaque activation de
 * la route, l'initialisation doit être rejouée. Cette méthode est idempotente.
 */
@Component({
  selector: 'app-home-page',
  imports: [ContactSection, NewsletterForm, RouterLink],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor() {
    queueMicrotask(() => window.appcoTheme?.init());
  }
}