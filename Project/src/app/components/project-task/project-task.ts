import { Component, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../services/projectsService/project-service';
import { Router } from '@angular/router';
import { TaskService } from '../../services/taskService/task-service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { title } from 'process';
import { patchTaskModel, postTaskModel } from '../../models/task.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatLabel, MatFormField } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard } from "@angular/material/card";
import {Commets} from '../commets/commets';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project-task',
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, MatIcon, MatLabel, MatFormField, MatSelectModule, MatInputModule, MatFormFieldModule, MatCard, Commets, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './project-task.html',
  styleUrl: './project-task.css',
})
export class ProjectTask {
projectId = input<string|undefined>();
private taskService = inject(TaskService);
private router = inject(Router);
private snackBar = inject(MatSnackBar);
tasks$ = this.taskService.currentTasks$;
errorMessage = signal<string | null>(null);
isLoading = signal<boolean>(false);


ngOnInit() {
  const id = this.projectId() || "1";
  this.isLoading.set(true);
  this.taskService.getTasksByProject(id).subscribe({
    next: () => {
      console.log("Tasks loaded successfully");
      this.isLoading.set(false);
    },
    error: (err) => {
      this.isLoading.set(false);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else if (err.status === 403) {
        this.snackBar.open('❌ אין לך הרשאה לצפות במשימות אלו', 'סגור', { duration: 5000 });
      } else if (err.status === 404) {
        this.router.navigate(['/error404']);
      } else if (err.status === 500) {
        this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
      } else {
        this.snackBar.open('❌ לא הצלחנו לטעון משימות', 'סגור', { duration: 5000 });
      }
      console.error("Could not find tasks for this project", err);
    }
  });
}
private fb = inject(NonNullableFormBuilder);
 taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    status: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    assigneeId: ['', [Validators.required]],
    dueDate: ['', [Validators.required]]
 });

addTask(){
   if (this.taskForm.valid) {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const formValues = this.taskForm.getRawValue();
      
      const payload: postTaskModel = {
        projectId: Number(this.projectId()),
        title: formValues.title,
        description: formValues.description,
        status: formValues.status as "todo" | "in_progress" | "done",
        priority: formValues.priority as "low" | "normal" | "high",
        assigneeId: Number(formValues.assigneeId),
        dueDate: new Date(formValues.dueDate),
        orderIndex: 0,
      };

     this.taskService.postTask(payload).subscribe({
       next: () => {
         this.taskForm.reset();
         this.snackBar.open('✅ המשימה נוספה בהצלחה', 'סגור', { duration: 3000 });
         this.isLoading.set(false);
       },
       error: (err) => {
         this.isLoading.set(false);
         if (err.status === 401) {
           this.router.navigate(['/login']);
         } else if (err.status === 403) {
           this.snackBar.open('❌ אין לך הרשאה ליצור משימה', 'סגור', { duration: 5000 });
         } else if (err.status === 404) {
           this.router.navigate(['/error404']);
         } else if (err.status === 500) {
           this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
         } else {
           this.snackBar.open('❌ שגיאה ביצירת משימה', 'סגור', { duration: 5000 });
         }
         console.error('Error creating task', err);
       }
     });
   }
 }
 editingId: number | null = null;
 updateTask = this.fb.group({
    title: [''],
    description: [''],
    status: [''],
    priority: [''],
    assignee_id: [''],
    due_date: [''],
 });
updateExistingTask(taskId: number) {
  if (this.updateTask.valid) {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const formValues = this.updateTask.getRawValue();
    const payload: Partial<patchTaskModel> = {};

    if (formValues.title) payload.title = formValues.title;
    if (formValues.description) payload.description = formValues.description;
    if (formValues.status) payload.status = formValues.status as any;
    if (formValues.priority) payload.priority = formValues.priority as any;
    
    if (formValues.assignee_id !== null && formValues.assignee_id !== '') {
      payload.assignee_id = Number(formValues.assignee_id);
    }

    if (formValues.due_date) {
      payload.due_date = new Date(formValues.due_date);
    }

    this.taskService.patchTask(taskId, payload).subscribe({
      next: () => {
        this.editingId = null;
        this.updateTask.reset();
        this.snackBar.open('✅ המשימה עודכנה בהצלחה', 'סגור', { duration: 3000 });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה לעדכן משימה זו', 'סגור', { duration: 5000 });
        } else if (err.status === 404) {
          this.router.navigate(['/error404']);
        } else if (err.status === 500) {
          this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ שגיאה בעדכון משימה', 'סגור', { duration: 5000 });
        }
        console.error("Update failed", err);
      }
    });
  }
}
  deleteTask(taskId:number){
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      this.errorMessage.set(null);
      this.isLoading.set(true);
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.snackBar.open('✅ המשימה נמחקה בהצלחה', 'סגור', { duration: 3000 });
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else if (err.status === 403) {
            this.snackBar.open('❌ אין לך הרשאה למחוק משימה זו', 'סגור', { duration: 5000 });
          } else if (err.status === 404) {
            this.router.navigate(['/error404']);
          } else if (err.status === 500) {
            this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
          } else {
            this.snackBar.open('❌ שגיאה במחיקת משימה', 'סגור', { duration: 5000 });
          }
          console.error('Error deleting task', err);
        }
      });
    }
  }


  
}