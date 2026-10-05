import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { SUBMISSION_SUCCESS, SubmissionResult } from '../models/submission-result';

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
    /**
     * Le for par `this.http.post<SubmissionResult>('/api/contact', request)`.
   */
  send(request: ContactRequest): Observable<SubmissionResult> {
    return of(SUBMISSION_SUCCESS).pipe(delay(600));
  }
}