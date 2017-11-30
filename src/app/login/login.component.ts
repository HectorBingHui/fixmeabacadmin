import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: boolean;
  userProfile: any;
  feeds: Observable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProfile = user;
        console.log(user)
      }
    })
  }

  ngOnInit() {
    this.login = false;
    this.fetchData();

  }

  signInWithGoogle() {
    try {
      const result = this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => this.login = true );
      }catch (e) {
      console.error(e);
    }
  }

  fetchData() {
   this.feeds =  this.afdb.list('report/open').valueChanges()
   console.log(this.feeds)
  }



}
