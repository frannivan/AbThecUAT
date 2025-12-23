import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
    // Hardcoded tenant for demo purposes. 
    // In a real app, this would come from a service, local storage, or environment config.
    const tenantId = 'abtech';

    const clonedRequest = req.clone({
        setHeaders: {
            'X-Tenant-ID': tenantId
        }
    });

    return next(clonedRequest);
};
