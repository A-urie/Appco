import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should start with no session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('should open a session on a successful login', async () => {
    service.login({ email: 'client@stylebox.ci', password: 'StyleBox2026' }).subscribe();

    expect(service.isAuthenticated()).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()).toEqual({ fullName: 'Aïcha Koné', email: 'client@stylebox.ci' });
  });

  it('should refuse unknown credentials', async () => {
    let failed = false;
    service.login({ email: 'client@stylebox.ci', password: 'mauvais' }).subscribe({
      error: () => (failed = true),
    });

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(failed).toBe(true);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should be case-insensitive on the email but not on the password', async () => {
    let failed = false;
    service.login({ email: 'CLIENT@STYLEBOX.CI', password: 'stylebox2026' }).subscribe({
      error: () => (failed = true),
    });

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(failed).toBe(true);
  });

  it('should register a new account and let it log in afterwards', async () => {
    service
      .register({ fullName: 'Serge Yao', email: 'serge.yao@stylebox.ci', password: 'motdepasse1' })
      .subscribe();
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(service.user()?.email).toBe('serge.yao@stylebox.ci');

    service.logout();
    expect(service.isAuthenticated()).toBe(false);

    service.login({ email: 'serge.yao@stylebox.ci', password: 'motdepasse1' }).subscribe();
    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should refuse to register over an existing email', async () => {
    let message = '';
    service
      .register({ fullName: 'Doublon', email: 'client@stylebox.ci', password: 'motdepasse1' })
      .subscribe({ error: (error: Error) => (message = error.message) });

    expect(message).toContain('existe déjà');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear the session on logout', async () => {
    service.login({ email: 'client@stylebox.ci', password: 'StyleBox2026' }).subscribe();
    await new Promise((resolve) => setTimeout(resolve, 700));

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });
});