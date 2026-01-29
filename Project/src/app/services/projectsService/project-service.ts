import { inject, Injectable } from '@angular/core';
import { AuthResponseModel } from '../../models/auth.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { createProjectModel, getProjectModel } from '../../models/projects.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private url = environment.BASE_URL + '/';
  private httpClient = inject(HttpClient);
  public currentProjects$ : Observable<getProjectModel[]|null>;
  private currentProjectsBehivorSubject : BehaviorSubject<getProjectModel[]|null> = new BehaviorSubject<getProjectModel[]|null>([]);

  constructor(){
    this.currentProjects$ = this.currentProjectsBehivorSubject; 
  }
  getProjectByUser(){
    return this.httpClient.get<getProjectModel[]>(this.url + 'api/projects').pipe(
      tap((projects) => {
        this.currentProjectsBehivorSubject.next(projects);
      })
    );
 }
 postProject(project:createProjectModel){
    return this.httpClient.post<getProjectModel>(this.url + 'api/projects', project).pipe(
      tap(project => {
        const currentProjects = this.currentProjectsBehivorSubject.getValue() || [];
        this.currentProjectsBehivorSubject.next([...currentProjects, project]);
      })
    );
 }
}