import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SUBMISSION_ERROR, SubmissionResult } from '../../../core/models/submission-result';
import { ContactService } from '../../../core/services/contact.service';

/**
 * Section « Contactez-nous ».
 *
 * Les règles de validation reprennent exactement celles du template d'origine, où
 * `validator.min.js` s'appuyait sur les attributs HTML : `name` et `email` étaient
 * `required`, `email` était de type `email`, et `phone`, `company` et `message`
 * restaient facultatifs.
 *
 * Le rendu du message de retour (`.message-box` / `.alert-success` / `.alert-danger`)
 * et les libellés sont conservés à l'identique.
 */
@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  private readonly contactService = inject(ContactService);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    company: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true }),
  });

  readonly result = signal<SubmissionResult | null>(null);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.result.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.result.set(SUBMISSION_ERROR);
      return;
    }

    this.contactService.send(this.form.getRawValue()).subscribe((result) => {
      this.result.set(result);

      if (result.success) {
        this.form.reset();
      }
    });
  }
}