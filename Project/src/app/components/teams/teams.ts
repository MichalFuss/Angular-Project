import { Component, inject, signal } from '@angular/core';
import { TeamsModel } from '../../models/teams.model';
import { TeamsService } from '../../services/teamsService/teams';
import { AsyncPipe } from '@angular/common';
import { TeamCard } from '../team-card/team-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-teams',
  imports: [AsyncPipe, TeamCard, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  private serviceTeams=inject(TeamsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public teams$ = this.serviceTeams.currentTeam$;
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  
  ngOnInit() {
    this.isLoading.set(true);
    this.serviceTeams.getAllTeams();
    this.isLoading.set(false);
  }
  teamNameControl = new FormControl('', { 
    nonNullable: true, 
    validators: [Validators.required, Validators.minLength(3)] 
  });

  addTeam() {
    if (this.teamNameControl.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);

    const name = this.teamNameControl.value;
    this.serviceTeams.postTeam(name).subscribe({
      next: () => {
        this.snackBar.open('✅ הקבוצה נוספה בהצלחה', 'סגור', { duration: 3000 });
        this.teamNameControl.reset();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה ליצור קבוצה', 'סגור', { duration: 5000 });
        } else if (err.status === 404) {
          this.router.navigate(['/error404']);
        } else if (err.status === 500) {
          this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ שגיאה בהוספת קבוצה', 'סגור', { duration: 5000 });
        }
        console.error('שגיאה בהוספת קבוצה', err);
      }
    });
  }
}