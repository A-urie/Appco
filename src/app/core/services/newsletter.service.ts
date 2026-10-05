import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { SUBMISSION_SUCCESS, SubmissionResult } from '../models/submission-result';

export interface NewsletterSubscription {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  /**
   * Les deux formulaires d'inscription (hero et pied de page) n'avaient aucun
   * gestionnaire : `action="#" method="post"` rechargeait la page et l'adresse
   * saisie n'était jamais transmise.
   *
   * TODO : remplacer le corps par `this.http.post<SubmissionResult>('/api/newsletter', subscription)`.
   */
  subscribe(subscription: NewsletterSubscription): Observable<SubmissionResult> {
    return of(SUBMISSION_SUCCESS).pipe(delay(600));
  }
}