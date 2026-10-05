import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<LoginPage>>;
  let component: LoginPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render both fields and the submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#login-email')).toBeTruthy();
    expect(compiled.querySelector('#login-password')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should mark both fields as touched and stay put when empty', () => {
    component.onSubmit(new Event('submit'));
    fixture.detectChanges();

    expect(component.form.controls.email.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
    expect(component.pending()).toBe(false);
    expect(component.errorMessage()).toBeNull();
  });

  it('should expose invalid feedback only once a field has been touched', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.invalid-feedback').length).toBe(0);

    component.onSubmit(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.invalid-feedback').length).toBe(2);
  });

  it('should render the error message returned by the service', async () => {
    component.form.setValue({ email: 'client@stylebox.ci', password: 'mauvais' });
    component.onSubmit(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    expect(component.pending()).toBe(false);
    expect(component.errorMessage()).toBe('Adresse e-mail ou mot de passe incorrect.');

    const alert = fixture.nativeElement.querySelector('.alert-danger') as HTMLElement;
    expect(alert.textContent).toContain('Adresse e-mail ou mot de passe incorrect.');
  });

  it('should navigate home once the credentials are accepted', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.form.setValue({ email: 'client@stylebox.ci', password: 'StyleBox2026' });
    component.onSubmit(new Event('submit'));

    // La session n'est ouverte qu'à l'émission, après le délai simulé : le
    // header ne doit pas basculer sur « Bonjour … » pendant le chargement.
    expect(component.pending()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(component.pending()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});