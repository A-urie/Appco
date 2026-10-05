import { TestBed } from '@angular/core/testing';
import { NewsletterForm } from './newsletter-form';

describe('NewsletterForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<NewsletterForm>>;
  let component: NewsletterForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NewsletterForm] }).compileComponents();
    fixture = TestBed.createComponent(NewsletterForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refuse an empty or malformed email', () => {
    component.form.controls.email.setValue('pas-un-email');
    component.onSubmit(new Event('submit'));

    expect(component.form.invalid).toBe(true);
    expect(component.hasError()).toBe(true);
    expect(component.hasSuccess()).toBe(false);
  });

  it('should accept a valid email and reset the field on success', async () => {
    component.form.controls.email.setValue('client@stylebox.ci');
    component.onSubmit(new Event('submit'));

    expect(component.form.valid).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    expect(component.hasSuccess()).toBe(true);
    expect(component.hasError()).toBe(false);
    expect(component.form.controls.email.value).toBe('');
  });

  it('should keep the ids given by the host so the theme CSS selectors still match', () => {
    fixture.componentRef.setInput('emailInputId', 'email-footer');
    fixture.componentRef.setInput('submitButtonId', 'submit-footer');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="email"]')!;
    const submit: HTMLInputElement = fixture.nativeElement.querySelector('input[type="submit"]')!;

    expect(input.id).toBe('email-footer');
    expect(submit.id).toBe('submit-footer');
  });
});