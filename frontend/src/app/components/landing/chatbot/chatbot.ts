import { Component, inject } from '@angular/core';
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
export class Chatbot {
  // ... existing logic but no changes needed other than imports
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  isOpen = false;
  isEmailCaptured = false;
  emailForm: FormGroup;
  messages: { text: string; sender: 'user' | 'bot' }[] = [
    { text: 'Hola, bienvenido a AbTech. ¿En qué podemos ayudarte?', sender: 'bot' }
  ];

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  submitEmail() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.leadService.createLead({
        name: 'Chatbot Lead',
        email: email,
        industry: 'Unknown',
        message: 'Lead captured via chatbot'
      }).subscribe({ // Fire and forget for UX speed
        next: () => console.log('Lead captured'),
        error: (err) => console.error('Lead capture failed', err)
      });

      this.messages.push({ text: email, sender: 'user' });
      this.isEmailCaptured = true;
      setTimeout(() => {
        this.messages.push({ text: '¡Gracias! ¿Qué información estás buscando hoy?', sender: 'bot' });
      }, 500);

      this.emailForm.reset();
    }
  }

  selectOption(option: string) {
    this.messages.push({ text: option, sender: 'user' });
    setTimeout(() => {
      let response = '';
      if (option === 'Ver Soluciones') response = 'Puedes explorar nuestras soluciones en la sección de Servicios.';
      else if (option === 'Solicitar Cotización') response = 'Claro, déjanos tus datos en el formulario de contacto y te enviaremos una propuesta.';
      else if (option === 'Hablar con Humano') response = 'Un asesor te contactará pronto al correo proporcionado.';

      this.messages.push({ text: response, sender: 'bot' });
    }, 600);
  }
}
