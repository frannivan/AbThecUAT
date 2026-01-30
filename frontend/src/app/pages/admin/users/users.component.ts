import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { finalize, switchMap, tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule], // Add RouterModule
    template: `
    <div class="p-6 bg-gray-50 min-h-screen font-sans">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header with Back Button -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div class="flex items-center gap-4">
            <a routerLink="/admin/dashboard" 
               class="p-2 text-gray-500 hover:text-indigo-600 bg-white rounded-full shadow-sm border border-gray-200 hover:border-indigo-200 transition-all"
               title="Volver al Dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Administración de Usuarios</h1>
              <p class="text-sm text-gray-500">Gestiona el acceso y roles del sistema</p>
            </div>
          </div>
          
          <button (click)="openModal()" 
                  class="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <!-- Async Wrapper: This handles the subscription and updates automatically -->
        <ng-container *ngIf="users$ | async as users">
        
            <!-- Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-gray-50/50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th class="px-6 py-4 border-b border-gray-100">ID</th>
                    <th class="px-6 py-4 border-b border-gray-100">Usuario</th>
                    <th class="px-6 py-4 border-b border-gray-100">Email</th>
                    <th class="px-6 py-4 border-b border-gray-100">Rol</th>
                    <th class="px-6 py-4 border-b border-gray-100 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let user of users" class="hover:bg-gray-50 transition-colors group">
                    <td class="px-6 py-4 text-gray-400 text-sm">#{{ user.id }}</td>
                    <td class="px-6 py-4">
                       <div class="flex items-center">
                         <div class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                            {{ user.username.charAt(0).toUpperCase() }}
                         </div>
                         <span class="font-medium text-gray-900">{{ user.username }}</span>
                       </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                            [ngClass]="{
                              'bg-purple-100 text-purple-700': user.role === 'ROLE_ADMIN',
                              'bg-blue-100 text-blue-700': user.role === 'ROLE_CLIENTE',
                              'bg-gray-100 text-gray-700': user.role === 'ROLE_USER'
                            }">
                        {{ formatRole(user.role) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button (click)="openModal(user)" class="text-gray-400 hover:text-indigo-600 transition-colors" title="Editar Usuario">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </td>
                  </tr>
                  <!-- Empty State -->
                  <tr *ngIf="users.length === 0 && !errorMessage">
                    <td colspan="5" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center justify-center text-gray-400">
                        <svg class="h-12 w-12 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No se encontraron usuarios.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
        </ng-container>
        
        <!-- Error Banner -->
        <div *ngIf="errorMessage && !showModal" class="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ errorMessage }}
        </div>

      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
        
        <!-- Modal Content -->
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all scale-100">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
          
          <form (ngSubmit)="saveUser()" autocomplete="off">
            <div class="space-y-5">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre de Usuario</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input type="text" [(ngModel)]="newUser.username" name="username" required minlength="3" placeholder="Ej: juanperez" autocomplete="new-username"
                         class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400">
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Corporativo</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" [(ngModel)]="newUser.email" name="email" required placeholder="juan@abtech.com" autocomplete="new-email"
                         class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400">
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña {{ isEditMode ? '(Opcional)' : '' }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                  </div>
                  <input type="password" [(ngModel)]="newUser.password" name="password" [required]="!isEditMode" minlength="6" placeholder="******" autocomplete="new-password"
                         class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400">
                </div>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Rol de Sistema</label>
                <div class="relative">
                    <select [(ngModel)]="selectedRole" name="role" required
                            class="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white appearance-none">
                      <option value="client">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
              </div>

              <!-- Error Message Local to Modal -->
              <div *ngIf="errorMessage && showModal" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 animate-pulse">
                {{ errorMessage }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between gap-3 mt-8">
               <!-- Delete Button (Only in Edit Mode) -->
               <div>
                  <button *ngIf="isEditMode" type="button" (click)="deleteUser()"
                          class="px-4 py-2.5 text-red-600 hover:text-red-800 font-medium hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                     <span>Eliminar</span>
                  </button>
               </div>

               <div class="flex gap-3">
                  <button type="button" (click)="closeModal()" 
                          class="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" 
                          [disabled]="isLoading"
                          class="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200">
                    <svg *ngIf="isLoading" class="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Usuario') }}</span>
                  </button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
    private adminService: AdminService = inject(AdminService);
    private cdr = inject(ChangeDetectorRef);
    private ngZone = inject(NgZone);

    private refreshTrigger = new BehaviorSubject<void>(undefined);

    // USERS OBSERVABLE - The core of the fix
    users$: Observable<any[]> = this.refreshTrigger.pipe(
        switchMap(() => this.adminService.getAllUsers().pipe(
            tap(data => console.log('>>> DEBUG: AsyncPipe received:', data)),
            catchError(err => {
                console.error('Error in users stream:', err);
                this.ngZone.run(() => this.errorMessage = 'Error cargando usuarios. Asegúrate de tener permisos de Admin.');
                return of([]); // Return empty to update UI
            })
        ))
    );

    showModal = false;
    isLoading = false;
    errorMessage = '';

    newUser = {
        username: '',
        email: '',
        password: '',
        role: []
    };

    selectedRole: string = 'client';

    // State for Edit Mode
    isEditMode = false;
    currentUserId: number | null = null;

    ngOnInit() {
        // Initial load is automatic due to BehaviorSubject initial value
    }

    // Updated openModal to support optional user for editing
    openModal(user: any = null) {
        this.showModal = true;
        this.errorMessage = '';

        if (user) {
            this.isEditMode = true;
            this.currentUserId = user.id;
            this.newUser = {
                username: user.username,
                email: user.email,
                password: '', // Don't pre-fill password
                role: []
            };
            // Map Role Enum to Select Value
            if (user.role === 'ROLE_ADMIN') this.selectedRole = 'admin';
            else if (user.role === 'ROLE_CLIENTE') this.selectedRole = 'client';
            else this.selectedRole = 'client';
        } else {
            this.isEditMode = false;
            this.currentUserId = null;
            this.newUser = { username: '', email: '', password: '', role: [] };
            this.selectedRole = 'client';
        }
    }

    closeModal() {
        this.showModal = false;
    }

    // Renamed to saveUser to handle both Create and Update
    saveUser() {
        this.isLoading = true;
        this.errorMessage = '';

        const payload = {
            ...this.newUser,
            role: [this.selectedRole]
        };

        const request$ = this.isEditMode && this.currentUserId
            ? this.adminService.updateUser(this.currentUserId, payload)
            : this.adminService.createUser(payload);

        request$
            .pipe(
                finalize(() => {
                    this.ngZone.run(() => {
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    });
                })
            )
            .subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        console.log('Operation success. Triggering refresh...');
                        this.closeModal();
                        this.refreshTrigger.next();
                    });
                },
                error: (err: any) => {
                    this.ngZone.run(() => {
                        console.error('Operation error:', err);
                        this.errorMessage = err.error?.message || 'Error al guardar usuario';
                    });
                }
            });
    }

    deleteUser() {
        if (!this.currentUserId) return;
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;

        this.isLoading = true;
        this.adminService.deleteUser(this.currentUserId)
            .pipe(finalize(() => this.ngZone.run(() => { this.isLoading = false; this.cdr.detectChanges(); })))
            .subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        this.closeModal();
                        this.refreshTrigger.next();
                    });
                },
                error: (err) => {
                    this.ngZone.run(() => this.errorMessage = 'Error al eliminar usuario');
                }
            });
    }

    formatRole(roleName: string): string {
        if (!roleName) return 'N/A';
        return roleName.replace('ROLE_', '').toUpperCase();
    }
}
