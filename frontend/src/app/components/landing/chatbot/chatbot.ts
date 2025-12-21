import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../../../services/lead';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements AfterViewChecked {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  isNameCaptured = signal(false);
  isContactCaptured = signal(false);
  isWaitingForContactMethod = signal(false);
  isWaitingForPhone = signal(false);
  isWaitingForEmail = signal(false);
  isWaitingForCompany = signal(false);

  nameForm: FormGroup;
  emailForm: FormGroup;
  phoneForm: FormGroup;
  companyForm: FormGroup;

  messages = signal<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: 'Hola, bienvenido a AbTech. ¿Cómo te llamas?', sender: 'bot' }
  ]);

  currentLead: any = {
    name: '',
    fullName: '',
    email: '',
    phone: '',
    industry: 'Unknown',
    message: 'Lead captured via chatbot sequential flow',
    source: 'CHATBOX'
  };

  constructor() {
    this.nameForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+]{8,15}$/)]]
    });
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  submitName() {
    if (this.nameForm.valid) {
      const name = this.nameForm.value.fullName;
      this.currentLead.fullName = name;
      this.currentLead.name = name; // Also set name to satisfy backend
      this.messages.update(m => [...m, { text: name, sender: 'user' }]);
      this.isNameCaptured.set(true);

      setTimeout(() => {
        this.messages.update(m => [...m, { text: `¡Mucho gusto, ${name}! ¿En qué podemos ayudarte hoy?`, sender: 'bot' }]);
      }, 500);
      this.nameForm.reset();
    }
  }

  selectOption(option: string) {
    this.messages.update(m => [...m, { text: option, sender: 'user' }]);
    setTimeout(() => {
      if (option === 'Hablar con Humano') {
        this.isWaitingForContactMethod.set(true);
        this.messages.update(m => [...m, { text: 'Excelente. ¿Cómo prefieres ser contactado? ¿WhatsApp o Correo?', sender: 'bot' }]);
      } else {
        let response = '';
        if (option === 'Ver Soluciones') response = 'Puedes explorar nuestras soluciones en la sección de Servicios.';
        else if (option === 'Solicitar Cotización') response = 'Claro, déjanos tus datos en el formulario de contacto y te enviaremos una propuesta.';
        this.messages.update(m => [...m, { text: response, sender: 'bot' }]);
      }
    }, 600);
  }

  selectContactMethod(method: 'WhatsApp' | 'Correo') {
    this.messages.update(m => [...m, { text: method, sender: 'user' }]);
    this.isWaitingForContactMethod.set(false);

    setTimeout(() => {
      if (method === 'WhatsApp') {
        this.isWaitingForPhone.set(true);
        this.messages.update(m => [...m, { text: 'Perfecto. Por favor, proporciona tu número de WhatsApp.', sender: 'bot' }]);
      } else {
        this.isWaitingForEmail.set(true);
        this.messages.update(m => [...m, { text: 'Muy bien. Por favor, proporciona tu correo electrónico.', sender: 'bot' }]);
      }
    }, 500);
  }

  submitPhone() {
    if (this.phoneForm.valid) {
      const phone = this.phoneForm.value.phone;
      this.currentLead.phone = phone;
      this.messages.update(m => [...m, { text: phone, sender: 'user' }]);
      this.isWaitingForPhone.set(false);
      this.processContactCapture();
      this.phoneForm.reset();
    }
  }

  submitEmail() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.currentLead.email = email;
      this.messages.update(m => [...m, { text: email, sender: 'user' }]);
      this.isWaitingForEmail.set(false);
      this.processContactCapture();
      this.emailForm.reset();
    }
  }

  private processContactCapture() {
    this.isContactCaptured.set(true);
    // Create lead if not already created (or update)
    this.leadService.createLead(this.currentLead).subscribe({
      next: (saved) => {
        this.currentLead.id = (saved as any).id;
        this.askNextOptionalField();
      },
      error: (err) => console.error('Lead creation failed', err)
    });
  }

  private askNextOptionalField() {
    setTimeout(() => {
      if (!this.currentLead.email) {
        this.isWaitingForEmail.set(true);
        this.messages.update(m => [...m, { text: '¿Deseas proporcionarnos también tu correo para enviarte más información?', sender: 'bot' }]);
      } else if (!this.currentLead.phone) {
        this.isWaitingForPhone.set(true);
        this.messages.update(m => [...m, { text: '¿Gustas dejarnos tu WhatsApp para un contacto más rápido?', sender: 'bot' }]);
      } else if (!this.currentLead.name || this.currentLead.name === 'Chatbot Lead') {
        this.isWaitingForCompany.set(true);
        this.messages.update(m => [...m, { text: '¿Cuál es el nombre de tu empresa o proyecto?', sender: 'bot' }]);
      } else {
        this.messages.update(m => [...m, { text: '¡Excelente! Un asesor se pondrá en contacto contigo pronto. ¡Ten un gran día!', sender: 'bot' }]);
      }
    }, 600);
  }

  submitCompany() {
    if (this.companyForm.valid) {
      const company = this.companyForm.value.name;
      this.currentLead.name = company;
      this.messages.update(m => [...m, { text: company, sender: 'user' }]);
      this.isWaitingForCompany.set(false);

      this.leadService.createLead(this.currentLead).subscribe({
        next: () => this.askNextOptionalField(),
        error: (err) => console.error('Update company failed', err)
      });
      this.companyForm.reset();
    }
  }
}
