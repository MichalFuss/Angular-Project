import { Component, inject, input, signal } from '@angular/core';
import { CommentService } from '../../services/commentService/comment-service';
import { CommentModel, PostCommentModel } from '../../models/comment.model';
import { MatFormField, MatInputModule, MatLabel } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-commets',
  imports: [MatFormField, MatLabel, MatIcon, MatInputModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './commets.html',
  styleUrl: './commets.css',
})
export class Commets {
taskId = input<number>();
private commentService = inject(CommentService);
private router = inject(Router);
private snackBar = inject(MatSnackBar);
comments = signal<CommentModel[]>([]);
isLoading = signal(false);
errorMessage = signal<string | null>(null);
newComment = signal('');

ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.isLoading.set(true); 
    this.errorMessage.set(null);
    const id_va = this.taskId();
    if(id_va===undefined) return;
  
    this.commentService.getCommentsByTask(id_va.toString()).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה לצפות בתגובות', 'סגור', { duration: 5000 });
        } else if (error.status === 404) {
          this.router.navigate(['/error404']);
        } else if (error.status === 500) {
          this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ לא הצלחנו לטעון תגובות', 'סגור', { duration: 5000 });
        }
        console.error('Error loading comments', error);
      }
    });
  
  }

  addComment() {
    const id_va = this.taskId();
    if (id_va === undefined) return;

    const content = this.newComment();
    if (!content || content.trim() === '') return;

    this.errorMessage.set(null);
    const newCommentPayload: PostCommentModel = { taskId: id_va, body: content };
    this.commentService.postComment(newCommentPayload).subscribe({
      next: (addedComment) => {
        this.comments.update(all => [...all, addedComment]);
        this.newComment.set('');
        this.snackBar.open('✅ תגובה נוספה בהצלחה', 'סגור', { duration: 3000 });
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.snackBar.open('❌ אין לך הרשאה להוסיף תגובה', 'סגור', { duration: 5000 });
        } else if (error.status === 404) {
          this.router.navigate(['/error404']);
        } else if (error.status === 500) {
          this.snackBar.open('⚠️ שגיאת שרת. אנא נסה שוב מאוחר יותר', 'סגור', { duration: 5000 });
        } else {
          this.snackBar.open('❌ שגיאה בהוספת תגובה', 'סגור', { duration: 5000 });
        }
        console.error('Error adding comment', error);
      }
    });
  }
}
