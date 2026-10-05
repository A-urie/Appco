import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../../core/services/newsletter.service';

/**
 * Formulaire d'inscription à la newsletter, utilisé deux fois (section hero et
 * pied de page). Les classes CSS sont portées par l'élément hôte afin de conserver
 * exactement les sélecteurs du template d'origine :
 * `.subscribe-form`, `.subscribe-form input.button`, `.subscribe-form-footer ...`
 * et `.subscribe-form #email` (qui cible un ID, d'où les entrées `emailInputId`).
 */
@Component({
  selector: 'app-newsletter-form',
  imports: [ReactiveFormsModule],
  templateUrl: './newsletter-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterForm {
  /** L'identifiant conditionne la règle `.subscribe-form #email` de `style.css`. */
  readonly emailInputId = input('email');
  readonly submitButtonId = input('submit');

  private readonly newsletterService = inject(NewsletterService);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly pending = signal(false);
  readonly hasError = signal(false);
  readonly hasSuccess = signal(false);

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.hasError.set(false);
    this.hasSuccess.set(false);

    if (this.form.invalid) {
      this.email.markAsTouched();
      this.hasError.set(true);
      return;
    }

    if (this.pending()) {
      return;
    }
    this.pending.set(true);

    this.newsletterService.subscribe(this.form.getRawValue()).subscribe((result) => {
      this.pending.set(false);
      this.hasSuccess.set(result.success);
      this.hasError.set(!result.success);

      if (result.success) {
        this.form.reset();
        this.email.markAsUntouched();
      }
    });
  }
}