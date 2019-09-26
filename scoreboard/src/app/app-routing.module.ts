import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StandingsComponent } from './standings/standings.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationResolver } from './service/authentication/authentication-resolver';
import { CompetitionsComponent } from './competitions/competitions.component';

const routes: Routes = [
  { path: 'standings/:id', component: StandingsComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'admin', component: AdminComponent, resolve: { token: AuthenticationResolver } },
  { path: 'login', component: LoginComponent, resolve: { token: AuthenticationResolver } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
