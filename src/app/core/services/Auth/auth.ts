import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));

  getToken() {
    return this.token();
  }

  isLoggedIn() {
    return computed(() => this.token() !== null);
  }

  setToken(newToken: string) {
    localStorage.setItem('token', newToken);
    this.token.set(newToken);
  }

  clearToken() {
    localStorage.removeItem('token');
    this.token.set(null);
  }
}