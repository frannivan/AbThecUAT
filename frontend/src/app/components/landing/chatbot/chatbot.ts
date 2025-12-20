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
  isEmailCaptured = signal(false);
  emailForm: FormGroup;
  messages = signal<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: 'Hola, bienvenido a AbTech. ¿En qué podemos ayudarte?', sender: 'bot' }
  ]);

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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

  submitEmail() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.leadService.createLead({
        name: 'Chatbot Lead',
        email: email,
        industry: 'Unknown',
        message: 'Lead captured via chatbot'
      }).subscribe({
        next: () => console.log('Lead captured'),
        error: (err) => console.error('Lead capture failed', err)
      });

      this.messages.update(m => [...m, { text: email, sender: 'user' }]);
      this.isEmailCaptured.set(true);

      setTimeout(() => {
        this.messages.update(m => [...m, { text: '¡Gracias! ¿Qué información estás buscando hoy?', sender: 'bot' }]);
      }, 500);

      this.emailForm.reset();
    }
  }

  selectOption(option: string) {
    this.messages.update(m => [...m, { text: option, sender: 'user' }]);
    setTimeout(() => {
      let response = '';
      if (option === 'Ver Soluciones') response = 'Puedes explorar nuestras soluciones en la sección de Servicios.';
      else if (option === 'Solicitar Cotización') response = 'Claro, déjanos tus datos en el formulario de contacto y te enviaremos una propuesta.';
      else if (option === 'Hablar con Humano') response = 'Un asesor te contactará pronto al correo proporcionado.';

      this.messages.update(m => [...m, { text: response, sender: 'bot' }]);
    }, 600);
  }
}
