import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../../services/lead';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+]{8,15}$/)]],
    industry: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  industries = [
    'Fintech',
    'Real Estate',
    'Salud (HealthTech)',
    'Turismo (Travel)',
    'Ecommerce',
    'Educación (EdTech)',
    'Recursos Humanos (HR)',
    'Otro'
  ];

  onSubmit() {
    this.submitSuccess = false;
    this.submitError = false;

    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const leadData = {
        name: this.contactForm.value.name,
        fullName: this.contactForm.value.fullName,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        industry: this.contactForm.value.industry,
        message: this.contactForm.value.message,
        source: 'WEBFORM'
      };

      this.leadService.createLead(leadData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();
        },
        error: (error: any) => {
          console.error('Error creating lead:', error);
          this.isSubmitting = false;
          this.submitError = true;
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
