import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponseModel, LoginModel, registerModel } from '../../models/auth.model';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.BASE_URL + '/';
  private httpClient = inject(HttpClient);
  public currentUser$ : Observable<AuthResponseModel|null>;
  private currentUserBehivorSubject : BehaviorSubject<AuthResponseModel|null> = new BehaviorSubject<AuthResponseModel|null>(null);
isLoggedIn = signal<boolean>(false);
userName = signal<string | null>(null);
  constructor(){
    this.currentUser$ = this.currentUserBehivorSubject; 
    if (typeof window !== 'undefined') {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      this.isLoggedIn.set(true);
      this.userName.set(user.user?.name || null); 
      this.currentUserBehivorSubject.next(user);
    }
  }
  }

register(data: registerModel): Observable<AuthResponseModel> {
  return this.httpClient.post<AuthResponseModel>(this.url + 'api/auth/register', data)
    .pipe(
      tap((response) => {
        this.currentUserBehivorSubject.next(response);
        sessionStorage.setItem('user', JSON.stringify(response));
        this.isLoggedIn.set(true);
        this.userName.set(response.user.name);
      })
    );
  }

login(data: LoginModel): Observable<AuthResponseModel> {
  return this.httpClient.post<AuthResponseModel>(this.url + 'api/auth/login', data)
    .pipe(
      tap((response) => {
        this.currentUserBehivorSubject.next(response);
        sessionStorage.setItem('user', JSON.stringify(response));
        this.isLoggedIn.set(true);
                this.userName.set(response.user.name);

      })
    );
  }


  logout(): void {
    this.currentUserBehivorSubject.next(null);
    sessionStorage.removeItem('user');
    this.isLoggedIn.set(false);
            this.userName.set(null);

  }
}
