import { Component, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../services/projectsService/project-service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { createProjectModel, getProjectModel } from '../../models/projects.model';
import { AsyncPipe } from '@angular/common';
import { TeamsModel } from '../../models/teams.model';
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardContent, MatCardTitle, MatCardHeader } from "@angular/material/card";
import { MatLabel, MatFormField, MatError, MatInputModule } from "@angular/material/input";
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-team-projects',
  imports: [AsyncPipe, ReactiveFormsModule, MatIcon, MatCard, MatCardContent, MatLabel, MatFormField, MatError, MatCardTitle, MatCardHeader,MatFormFieldModule,MatInputModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './team-projects.html',
  styleUrl: './team-projects.css',
})
export class TeamProjects {
id=input.required<string>();
private router = inject(Router);
private projectService = inject(ProjectService);
private snackBar = inject(MatSnackBar);
projects$ = this.projectService.currentProjects$;
errorMessage = signal<string | null>(null);
isLoading = signal<boolean>(false);

ngOnInit(){
  this.isLoading.set(true);
  this.projectService.getProjectByUser().subscribe({
    next: () => {
      console.log('Projects loaded');
      this.isLoading.set(false);
    },
    error: (err) => {
      this.isLoading.set(false);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else if (err.status === 403) {
        this.snackBar.open('❌ אין לך הרשאה לצפות בפרויקטים', 'סגור', { duration: 5000 });
      } else if (err.status === 404) {
        this.router.navigate(['/error404']);
      } else if (err.status === 500) {
        this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
      } else {
        this.snackBar.open('❌ לא הצלחנו לטעון פרויקטים', 'סגור', { duration: 5000 });
      }
      console.error('Error loading projects', err);
    }
  });
  }
 private fb = inject(NonNullableFormBuilder);
 projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
 });

 onSubmit(){
   if (this.projectForm.valid) {
     this.errorMessage.set(null);
     this.isLoading.set(true);
     const newProject: createProjectModel = {
       teamId: Number(this.id()),
       ...this.projectForm.getRawValue()
     };
     this.projectService.postProject(newProject).subscribe({
       next: () => {
         this.projectForm.reset();
         this.snackBar.open('✅ הפרויקט נוצר בהצלחה', 'סגור', { duration: 3000 });
         this.isLoading.set(false);
       },
       error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה ליצור פרויקט', 'סגור', { duration: 5000 });
        } else if (err.status === 404) {
          this.router.navigate(['/error404']);
        } else if (err.status === 500) {
          this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ שגיאה ביצירת הפרויקט', 'סגור', { duration: 5000 });
        }
        console.error('שגיאה ביצירת הפרויקט', err);
       }
     });
   }
}

goToTasks(projectId: number) {
    this.router.navigate(['/tasks', projectId]);
  }
 }
