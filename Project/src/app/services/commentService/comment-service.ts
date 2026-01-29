import { inject, Injectable } from '@angular/core';
import { AuthResponseModel } from '../../models/auth.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommentModel } from '../../models/comment.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class CommentService {
  private url = environment.BASE_URL + '/api/comments';
  private http = inject(HttpClient);

  // Just return the Observable; let the component decide what to do with it
  getCommentsByTask(taskId: string): Observable<CommentModel[]> {
    const params = new HttpParams().set('taskId', taskId);
    return this.http.get<CommentModel[]>(this.url, { params });
  }

  postComment(comment: Partial<CommentModel>): Observable<CommentModel> {
    return this.http.post<CommentModel>(this.url, comment);
  }
}