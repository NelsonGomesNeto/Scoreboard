import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StandingsComponent } from './standings/standings.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule, MatTableModule, MatCommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatFormFieldControl, MatInputModule, MatButtonModule, MatExpansionModule, MatCardModule, MatIconModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthenticationResolver } from './service/authentication/authentication-resolver';

@NgModule({
   declarations: [
      AppComponent,
      StandingsComponent,
      AdminComponent,
      LoginComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatTableModule,
      MatSortModule,
      MatCommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      FormsModule,
      MatExpansionModule,
      MatCardModule,
      MatIconModule,
      MatChipsModule
   ],
   providers: [
      AuthenticationResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
