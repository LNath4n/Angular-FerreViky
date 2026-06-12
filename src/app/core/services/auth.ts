// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId = signal<number | null>(null);

  // Getter
  getUserId() {
    return this.userId();
  }

  // Para usarlo como signal reactivo (si lo necesitas en template)
  getUserIdSignal() {
    return this.userId.asReadonly();
  }

  setUserId(id: number) {
    this.userId.set(id);
  }

  clearUserId() {
    this.userId.set(null);
  }
}