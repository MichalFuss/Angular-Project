import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { first } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal<string | null>(null);
  
  public registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: (user) => {
          if(user){
            this.router.navigate(['/teams']);
          }
        },
        error: (err) => {
          console.log("err", err);
          if (err.status === 409) {
            this.errorMessage.set('המשתמש כבר קיים במערכת');
          } else if (err.status === 404) {
            this.router.navigate(['/error404']);
          } else {
            this.errorMessage.set('אופס! קרתה שגיאה בחיבור לשרת');
          }
        }
      });
    }
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}