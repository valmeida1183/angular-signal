import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();

  isLoggedIn = computed(() => !!this.user());

  constructor() {
    this.loadUserFromLocalStorage();

    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user$ = this.http.post<User>(`${environment.apiRoot}/login`, {
      email,
      password,
    });

    const user = await firstValueFrom(user$);
    this.#userSignal.set(user);

    return user;
  }

  async logout(): Promise<void> {
    this.#userSignal.set(null);
    localStorage.removeItem(USER_STORAGE_KEY);

    await this.router.navigateByUrl('/login');
  }

  private loadUserFromLocalStorage(): void {
    const jsonUser = localStorage.getItem(USER_STORAGE_KEY);
    if (jsonUser) {
      const user = JSON.parse(jsonUser);
      this.#userSignal.set(user);
    }
  }
}
