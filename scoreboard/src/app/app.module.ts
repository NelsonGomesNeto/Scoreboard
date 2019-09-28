import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StandingsComponent } from './standings/standings.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule, MatTableModule, MatCommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatFormFieldControl, MatInputModule, MatButtonModule, MatExpansionModule, MatCardModule, MatIconModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule, MatDividerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthenticationResolver } from './service/authentication/authentication-resolver';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CompetitionsComponent } from './competitions/competitions.component';

@NgModule({
   declarations: [
      AppComponent,
      StandingsComponent,
      AdminComponent,
      LoginComponent,
      CompetitionsComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatTableModule,
      MatSortModule,
      MatCommonModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      FormsModule,
      MatExpansionModule,
      MatCardModule,
      MatIconModule,
      MatChipsModule,
      MatDatepickerModule,
      MatNativeDateModule,
      AmazingTimePickerModule,
      MatProgressBarModule,
      MatDividerModule
   ],
   providers: [
      AuthenticationResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
