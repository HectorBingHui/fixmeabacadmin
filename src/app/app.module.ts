import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from '../app/feeds/feeds.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { LoginComponent } from './login/login.component';
import { FeedsComponent } from './feeds/feeds.component';



export const firebaseConfig = {
  apiKey: 'AIzaSyD9wBjZlpm2qOyUlnzh4Ax_8a22p2kTayo',
  authDomain: 'fixmeabac.firebaseapp.com',
  databaseURL: 'https://fixmeabac.firebaseio.com',
  projectId: 'fixmeabac',
  storageBucket: '',
  messagingSenderId: '483379790841'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FeedsComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
      path: 'home',
      component: LoginComponent
    }]),
    AngularFireModule.initializeApp(firebaseConfig),

  ],
  providers: [AngularFireAuth, AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
