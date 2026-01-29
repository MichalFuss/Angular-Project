import { Component, inject, input, signal } from '@angular/core';
import { postTeamMemberModel, TeamsModel } from '../../models/teams.model';
import { TeamsService } from '../../services/teamsService/teams';
import { NonNullableFormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators } from '@angular/forms';
import { MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardContent, MatCard, MatCardActions } from "@angular/material/card";
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-team-card',
  imports: [MatDividerModule, DatePipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardContent, MatCard, MatCardActions, MatSnackBarModule],
  templateUrl: './team-card.html',
  styleUrl: './team-card.css',
})
export class TeamCard {
team=input.required<TeamsModel>();
private serviceTeams=inject(TeamsService);
private fb = inject(NonNullableFormBuilder);
private router = inject(Router);
private snackBar = inject(MatSnackBar);
isLoading = signal<boolean>(false);

public addMemberForm =this.fb.group({
  userId: ['', [Validators.required]]
});

addMember() {
  if (this.addMemberForm.valid) {
    this.isLoading.set(true);
    const payload: postTeamMemberModel = {
      userId: this.addMemberForm.getRawValue().userId,
      teamId: this.team().id
    };

    this.serviceTeams.addMemberToTeam(payload).subscribe({
      next: () => {
        this.addMemberForm.reset();
        this.snackBar.open('✅ החבר נוסף בהצלחה', 'סגור', { duration: 3000 });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה להוסיף חברים', 'סגור', { duration: 5000 });
        } else if (err.status === 404) {
          this.snackBar.open('❌ משתמש לא נמצא', 'סגור', { duration: 5000 });
        } else if (err.status === 409) {
          this.snackBar.open('❌ החבר כבר בצוות', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ שגיאה בהוספת חבר', 'סגור', { duration: 5000 });
        }
        console.error('שגיאה בהוספת משתמש', err);
      }
    });
  }
}

goToProjects(team: TeamsModel) {
  this.router.navigate(['/projects', team.id]); 
}
}