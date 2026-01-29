import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Teams } from './components/teams/teams';
import { Login } from './components/login/login';
import { TeamProjects } from './components/team-projects/team-projects';
import { ProjectTask } from './components/project-task/project-task';
import { authguardGuard } from './guard/authguard-guard';
import { Error404 } from './components/error404/error404';

export const routes: Routes = [
    {path:'', redirectTo:'/register', pathMatch:'full'},
    {path:'register', component: Register},
    {path:'login', component: Login},
    {path:'teams',component:Teams,canActivate: [authguardGuard]},
    {path: 'projects/:id',  component: TeamProjects,canActivate: [authguardGuard]} ,
  {path:'tasks/:projectId', component:ProjectTask,canActivate: [authguardGuard]},
  {path:'**',component:Error404 }
    
];
