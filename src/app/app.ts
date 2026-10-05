import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeScriptLoader } from './core/services/theme-script-loader.service';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';

/**
 * Coquille applicative : en-tête, contenu routé et pied de page.
 * Le contenu de la landing page vit désormais dans `HomePage`.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooter, SiteHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly themeScripts = inject(ThemeScriptLoader);

  ngAfterViewInit(): void {
    void this.themeScripts.load();
  }
}