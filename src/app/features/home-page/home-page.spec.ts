import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the hero title', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Habillez-vous en quelques clics');
  });

  it('should mount both newsletter forms and the contact section', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('app-newsletter-form').length).toBe(2);
    expect(compiled.querySelector('app-contact-section')).toBeTruthy();
  });

  it('should route every pricing call to action to the registration page', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const ctas = compiled.querySelectorAll('#pricing .single-pricing-pack a.btn');
    expect(ctas.length).toBe(3);
    ctas.forEach((cta) => {
      expect(cta.getAttribute('href')).toBe('/register#top');
    });
  });

  it('should route every blog entry to the blog page', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const entries = compiled.querySelectorAll('#blog a[href="/blog"]');
    expect(entries.length).toBe(6);
  });

  it('should expose a single h1 and keep every intermediate heading tagged', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('h1').length).toBe(1);

    // Les titres intermédiaires conservent leur taille d'origine via les
    // utilitaires Bootstrap `h3`..`h6` plutôt que de redeclencher une hiérarchie.
    compiled.querySelectorAll('h3, h4, h5, h6').forEach((heading) => {
      expect(heading.className).toMatch(/\bh[3-6]\b/);
    });
  });

  it('should not rely on the removed jQuery page-scroll handler', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Le défilement vers les ancres est désormais géré par le routeur.
    expect(compiled.querySelectorAll('.page-scroll').length).toBe(0);
  });

  it('should provide an anchor for every navigation entry', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Une ancre absente fait silenciusement échouer le défilement du routeur :
    // « Accueil » était le cas le plus exposé.
    ['top', 'about', 'features', 'pricing', 'screenshots', 'blog', 'team', 'contact'].forEach(
      (fragment) => {
        expect(compiled.querySelector(`#${fragment}`)).toBeTruthy();
      },
    );
  });
});