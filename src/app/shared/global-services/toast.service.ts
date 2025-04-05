// src/app/shared/services/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastSubject.next({ message, type });
  }
}