import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  messageService = inject(MessagesService);

  form = this.buildForm();

  async onLogin(): Promise<void> {
    try {
      const { email, password } = this.form.value;

      // For simplicity this project not handling this kind of situation by forms validations. The main focus here is signals
      if (!email || !password) {
        this.messageService.showMessage('Enter an email and password', 'error');
        return;
      }

      await this.authService.login(email, password);
      await this.router.navigate([`/home`]);
    } catch (error) {
      console.error(error);
      this.messageService.showMessage(
        'Login failed, please try again',
        'error'
      );
    }
  }

  private buildForm() {
    return this.formBuilder.nonNullable.group({
      email: [''],
      password: [''],
    });
  }
}
