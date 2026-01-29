import { inject, Injectable } from '@angular/core';
import { AuthResponseModel } from '../../models/auth.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { TeamsModel , postTeamMemberModel } from '../../models/teams.model';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private url = environment.BASE_URL + '/';
  private httpClient = inject(HttpClient);
  public currentTeam$ : Observable<TeamsModel[]|null>;
  private currentTeamBehivorSubject : BehaviorSubject<TeamsModel[]|null> = new BehaviorSubject<TeamsModel[]|null>(null);

  constructor(){
    this.currentTeam$ = this.currentTeamBehivorSubject; 
  }

  getAllTeams() {
    return this.httpClient.get<TeamsModel[]>(this.url + 'api/teams').subscribe({
      next: (teams) => {
        this.currentTeamBehivorSubject.next(teams);
      }
    }) ;
  }
  postTeam(name:string) :Observable<TeamsModel> {
    return this.httpClient.post<TeamsModel>(this.url + 'api/teams', {name}).pipe(
      tap(team => {
        const currentTeams = this.currentTeamBehivorSubject.getValue() || [];
        this.currentTeamBehivorSubject.next([...currentTeams, team]);
      })
    );
  }
addMemberToTeam(postmember: postTeamMemberModel): Observable<postTeamMemberModel> {
    return this.httpClient.post<postTeamMemberModel>(`${this.url}api/teams/${postmember.teamId}/members`, postmember).pipe(
      tap(() => {
      const teams = this.currentTeamBehivorSubject.getValue();
  if (teams) {
    // חובה להציב את תוצאת ה-map במשתנה חדש
    const updatedTeams = teams.map(team => {
      if (team.id === postmember.teamId) {
        return { ...team, members_count: (team.members_count||0) + 1 };
      }
      return team;
    });
    // מעדכנים את ה-Subject עם המערך החדש שנוצר
    this.currentTeamBehivorSubject.next(updatedTeams);
       }
            }
    )
    );
  }

}