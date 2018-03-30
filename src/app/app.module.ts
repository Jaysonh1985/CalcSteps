import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router, Routes } from '@angular/router';
import { AngularFireModule, } from 'angularfire2';
import { Component } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {routes} from './app.router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    routes,
    AngularFirestoreModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBM-ns8GzoibvP4ZOVaZ1MgpVLDnaNNw98',
      authDomain: 'calc-steps.firebaseapp.com',
      databaseURL: 'https://calc-steps.firebaseio.com',
      projectId: 'calc-steps',
      storageBucket: 'calc-steps.appspot.com',
      messagingSenderId: '468301501954'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
