import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/admin/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

import { Leads } from './pages/admin/leads/leads';
import { LeadDetail } from './pages/admin/leads/lead-detail';
import { Clients } from './pages/admin/clients/clients';
import { ClientDetail } from './pages/admin/clients/client-detail';
import { Opportunities } from './pages/admin/opportunities/opportunities';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    {
        path: 'admin',
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'leads', component: Leads },
            { path: 'opportunities', component: Opportunities },
            { path: 'leads/:id', component: LeadDetail },
            { path: 'clients', component: Clients },
            { path: 'clients/:id', component: ClientDetail },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
