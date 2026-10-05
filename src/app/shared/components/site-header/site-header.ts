import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavLink {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly auth = inject(AuthService);

  protected readonly links: NavLink[] = [
    { label: 'Accueil', fragment: 'top' },
    { label: 'À propos', fragment: 'about' },
    { label: 'Fonctionnalités', fragment: 'features' },
    { label: 'Tarifs', fragment: 'pricing' },
    { label: "Captures d'écran", fragment: 'screenshots' },
    { label: 'Blog', fragment: 'blog' },
    { label: 'Équipe', fragment: 'team' },
    { label: 'Contact', fragment: 'contact' },
  ];
}