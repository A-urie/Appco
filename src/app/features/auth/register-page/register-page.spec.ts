import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RegisterPage } from './register-page';

describe('RegisterPage', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<RegisterPage>>;
  let component: RegisterPage;

  const validPayload = {
    fullName: 'Serge Yao',
    email: 'serge.yao@stylebox.ci',
    password: 'motdepasse1',
    confirmPassword: 'motdepasse1',
    acceptTerms: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render every field of the registration form', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#register-name')).toBeTruthy();
    expect(compiled.querySelector('#register-email')).toBeTruthy();
    expect(compiled.querySelector('#register-password')).toBeTruthy();
    expect(compiled.querySelector('#register-confirm')).toBeTruthy();
    expect(compiled.querySelector('#register-terms')).toBeTruthy();
  });

  it('should mark every field as touched and stay put when empty', () => {
    component.onSubmit(new Event('submit'));
    fixture.detectChanges();

    expect(component.form.controls.fullName.touched).toBe(true);
    expect(component.form.controls.email.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
    expect(component.form.controls.confirmPassword.touched).toBe(true);
    expect(component.form.controls.acceptTerms.touched).toBe(true);
    expect(component.pending()).toBe(false);
  });

  it('should require the explicit acceptance of the terms', () => {
    component.form.patchValue({ ...validPayload, acceptTerms: false });

    expect(component.form.controls.acceptTerms.hasError('required')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('should refuse a short password', () => {
    component.form.patchValue({ ...validPayload, password: 'court', confirmPassword: 'court' });

    expect(component.form.controls.password.hasError('minlength')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('should refuse mismatched passwords', () => {
    component.form.patchValue({ ...validPayload, confirmPassword: 'autre-mot-de-passe1' });

    expect(component.form.hasError('passwordMismatch')).toBe(true);
    expect(component.form.controls.confirmPassword.hasError('passwordMismatch')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('should clear the mismatch as soon as the confirmation matches again', () => {
    component.form.patchValue({ ...validPayload, confirmPassword: 'autre-mot-de-passe1' });
    expect(component.form.hasError('passwordMismatch')).toBe(true);

    component.form.controls.confirmPassword.setValue('motdepasse1');

    expect(component.form.hasError('passwordMismatch')).toBe(false);
    expect(component.form.valid).toBe(true);
  });

  it('should surface the conflict raised by the service', () => {
    component.form.patchValue({ ...validPayload, email: 'client@stylebox.ci' });
    component.onSubmit(new Event('submit'));

    expect(component.errorMessage()).toBe('Un compte existe déjà avec cette adresse e-mail.');
  });

  it('should navigate home once the account is created', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.form.setValue(validPayload);
    component.onSubmit(new Event('submit'));

    expect(component.pending()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(component.pending()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('should link back to the login page', () => {
    const link = fixture.nativeElement.querySelector('a[href^="/login"]') as HTMLElement;

    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Se connecter');
  });
});