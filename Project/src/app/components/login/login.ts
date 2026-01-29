import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth-service';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal<string | null>(null);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (user) => {
          if(user){
            this.router.navigate(['/teams']);
          }
        },
        error: (err) => {
          console.log("err", err);
          if (err.status === 401) {
            this.errorMessage.set('אימייל או סיסמה שגויים');
          } else if (err.status === 404) {
            this.router.navigate(['/error404']);
          } else {
            this.errorMessage.set('אופס! קרתה שגיאה בחיבור לשרת');
          }
        }
      });
    }
  }
}

