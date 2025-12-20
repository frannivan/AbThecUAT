import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    isLoading = false;
    errorMessage = '';

    onSubmit() {
        this.errorMessage = '';
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    // Navigate to admin dashboard (placeholder for now, or create route)
                    this.router.navigate(['/admin/dashboard']);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Login error', err);
                    this.errorMessage = 'Credenciales inválidas. Por favor intente de nuevo.';
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
