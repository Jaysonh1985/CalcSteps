import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router, Routes } from '@angular/router';
import { AngularFireModule, } from 'angularfire2';
import { Component } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
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
