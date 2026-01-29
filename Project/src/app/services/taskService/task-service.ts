import { inject, Injectable } from '@angular/core';
import { AuthResponseModel } from '../../models/auth.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getTaskModel, patchTaskModel, postTaskModel } from '../../models/task.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private url = environment.BASE_URL + '/api/tasks';
  private httpClient = inject(HttpClient);
  public currentTasks$ : Observable<getTaskModel[]|null>;
  private currentTasksBehivorSubject : BehaviorSubject<getTaskModel[]|null> = new BehaviorSubject<getTaskModel[]|null>(null);

  constructor(){
    this.currentTasks$ = this.currentTasksBehivorSubject; 
  }
  getTasksByProject(projectId:string){
    const params = new HttpParams().set('projectId', projectId);
    return this.httpClient.get<getTaskModel[]>(this.url, { params }).pipe(
      tap((tasks) => {
        this.currentTasksBehivorSubject.next(tasks);
      })
    );
}

postTask(task:postTaskModel){
    return this.httpClient.post<getTaskModel>(this.url, task).pipe(
      tap(task => {
        const currentTasks = this.currentTasksBehivorSubject.getValue() || [];
        this.currentTasksBehivorSubject.next([...currentTasks, task]);
      })
    );
}
patchTask(taskId:number, task:Partial<patchTaskModel>){
    return this.httpClient.patch<getTaskModel>(`${this.url}/${taskId}`, task).pipe(
      tap(updatedTask => {
        const currentTasks = this.currentTasksBehivorSubject.getValue() || [];
        const updatedTasks = currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        this.currentTasksBehivorSubject.next(updatedTasks);
      })
    );

}
deleteTask(taskId:number){
    return this.httpClient.delete<void>(this.url + `/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.currentTasksBehivorSubject.getValue() || [];
        const updatedTasks = currentTasks.filter(t => t.id !== taskId);
        this.currentTasksBehivorSubject.next(updatedTasks);
      })
    );
}
}