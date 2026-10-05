import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';
import { ThemeScriptLoader } from './core/services/theme-script-loader.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        // Neutralise le chargement de jQuery : inutile et coûteux sous Karma.
        { provide: ThemeScriptLoader, useValue: { load: () => Promise.resolve() } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header, the router outlet and the footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-site-header')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-site-footer')).toBeTruthy();
  });

  it('should no longer embed the landing page sections', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Le contenu de la home a été déplacé dans HomePage : le shell ne doit
    // contenir ni le hero, ni les formulaires, ni la section de contact.
    expect(compiled.querySelector('h1')).toBeNull();
    expect(compiled.querySelector('app-newsletter-form')).toBeNull();
    expect(compiled.querySelector('app-contact-section')).toBeNull();
  });

  it('should expose working routes for the landing page and the auth pages', () => {
    expect(routes.map((route) => route.path)).toEqual(['', 'login', 'register', '**']);
    expect(routes[0].path).toBe('');
    expect(routes.at(-1)).toEqual({ path: '**', redirectTo: '' });

    // Chaque page routée porte un titre de document ; le catch-all est exclu.
    expect(routes.slice(0, -1).map((route) => route.title)).toEqual([
      'StyleBox, la mode accessible livrée chez vous',
      'Connexion',
      'Créer un compte',
    ]);
  });

  it('should lazy-load every routed page', () => {
    expect(routes.slice(0, -1).every((route) => route.loadComponent !== undefined)).toBe(true);
  });
});