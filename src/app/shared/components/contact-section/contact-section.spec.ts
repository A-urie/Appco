import { TestBed } from '@angular/core/testing';
import { ContactSection } from './contact-section';

describe('ContactSection', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ContactSection>>;
  let component: ContactSection;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactSection] }).compileComponents();
    fixture = TestBed.createComponent(ContactSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only require name and email, as in the original template', () => {
    expect(component.form.controls.name.hasError('required')).toBe(true);
    expect(component.form.controls.email.hasError('required')).toBe(true);
    expect(component.form.controls.phone.valid).toBe(true);
    expect(component.form.controls.company.valid).toBe(true);
    expect(component.form.controls.message.valid).toBe(true);
  });

  it('should report an error when required fields are missing', () => {
    component.onSubmit(new Event('submit'));

    expect(component.result()).toEqual({
      success: false,
      message: 'Found error in the form. Please check again.',
    });
  });

  it('should reject a malformed email', () => {
    component.form.patchValue({ name: 'Aïcha Koné', email: 'pas-un-email' });
    component.onSubmit(new Event('submit'));

    expect(component.result()?.success).toBe(false);
  });

  it('should report success and reset the form when the payload is valid', async () => {
    component.form.patchValue({
      name: 'Aïcha Koné',
      email: 'aicha.kone@stylebox.ci',
      phone: '+225 07 00 00 00 00',
      company: 'StyleBox',
      message: 'Bonjour, je souhaite connaître les délais de livraison.',
    });
    component.onSubmit(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    expect(component.result()).toEqual({
      success: true,
      message: 'Form submitted successfully',
    });
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.email.value).toBe('');
  });

  it('should render the feedback banner with the success variant', async () => {
    component.form.patchValue({ name: 'Serge Yao', email: 'serge.yao@stylebox.ci' });
    component.onSubmit(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.message-box') as HTMLElement;
    const alert = fixture.nativeElement.querySelector('.message-box .alert') as HTMLElement;

    expect(box.classList.contains('d-block')).toBe(true);
    expect(box.classList.contains('d-none')).toBe(false);
    expect(alert.classList.contains('alert-success')).toBe(true);
    expect(alert.classList.contains('alert-danger')).toBe(false);
  });
});