// src/app/shared/components/toast/toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="toast-container">
      <div class="toast" [ngClass]="currentToast?.type || 'success'">
        <div class="toast-message">{{ currentToast?.message }}</div>
        <button class="toast-close" (click)="hideToast()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
    
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 250px;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      animation: slide-in 0.3s ease-out;
    }
    
    .success {
      background-color: #4caf50;
      color: white;
    }
    
    .error {
      background-color: #f44336;
      color: white;
    }
    
    .info {
      background-color: #2196f3;
      color: white;
    }
    
    .toast-message {
      flex: 1;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
      opacity: 0.8;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  currentToast: Toast | null = null;
  timeout: any;
  subscription: Subscription | null = null;
  
  constructor(private toastService: ToastService) {}
  
  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.showToast(toast);
    });
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  showToast(toast: Toast): void {
    // Clear any existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.currentToast = toast;
    this.visible = true;
    
    // Auto hide after 3 seconds
    this.timeout = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }
  
  hideToast(): void {
    this.visible = false;
  }
}