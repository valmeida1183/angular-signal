import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpContextToken,
} from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (request.context.get(SkipLoading)) {
    return next(request);
  }

  const loadingService = inject(LoadingService);
  loadingService.loadingOn();

  return next(request).pipe(
    finalize(() => {
      loadingService.loadingOff();
    })
  );
};

export const SkipLoading = new HttpContextToken(() => false);
