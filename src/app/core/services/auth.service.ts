import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { SubmissionResult } from '../models/submission-result';
import { AuthUser, LoginRequest, RegisterRequest } from '../models/auth.models';

/**
 * Session utilisateur de l'application.
 *
 * Aucun back-end n'est branché sur ce projet : l'authentification est donc
 * simulée, exactement comme pour le formulaire de contact et la newsletter. La
 * session n'est conservée qu'en mémoire, sans persistance.
 *
 * TODO : remplacer les corps de `register`, `login` et `logout` par des appels
 * HTTP (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`) et persister
 * le jeton renvoyé.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<AuthUser | null>(null);

  /**
   * Les mutations ne sont appliquées qu'à l'émission de l'observable, après le
   * `delay` : écrire la session dans le corps de la méthode ouvrirait la session
   * avant même que l'appelant ne s'abonne, et le header basculerait sur
   * « Bonjour … » pendant les 600 ms du chargement au lieu de l'état « pending ».
   */
  private readonly accounts: (LoginRequest & AuthUser)[] = [
    { email: 'client@stylebox.ci', password: 'StyleBox2026', fullName: 'Aïcha Koné' },
  ];

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  register(request: RegisterRequest): Observable<SubmissionResult> {
    if (this.isEmailTaken(request.email)) {
      return throwError(() => new Error('Un compte existe déjà avec cette adresse e-mail.'));
    }

    const user: AuthUser = { fullName: request.fullName, email: request.email };

    return of<SubmissionResult>(REGISTERED).pipe(
      delay(600),
      tap(() => {
        this.accounts.push({ ...user, password: request.password });
        this.currentUser.set(user);
      }),
    );
  }

  login(request: LoginRequest): Observable<SubmissionResult> {
    const account = this.accounts.find(
      (candidate) =>
        candidate.email.toLowerCase() === request.email.toLowerCase() &&
        candidate.password === request.password,
    );

    if (!account) {
      return throwError(() => new Error('Adresse e-mail ou mot de passe incorrect.'));
    }

    return of<SubmissionResult>(SIGNED_IN).pipe(
      delay(600),
      tap(() => this.currentUser.set({ fullName: account.fullName, email: account.email })),
    );
  }

  logout(): void {
    this.currentUser.set(null);
  }

  private isEmailTaken(email: string): boolean {
    return this.accounts.some((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  }
}

const REGISTERED: SubmissionResult = {
  success: true,
  message: 'Votre compte a bien été créé.',
};

const SIGNED_IN: SubmissionResult = {
  success: true,
  message: 'Connexion réussie.',
};