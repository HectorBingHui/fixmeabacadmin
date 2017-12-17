import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.scss']
})
export class ClosedComponent implements OnInit {
  feeds: Observable<any[]>;
  islogin: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
  ) {
    this.islogin = false;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.islogin = true;
      }
      if (!user) {
        this.islogin = false;
      }
    });
  }

  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    if (this.islogin = true) {
      this.feeds = this.afdb.list('report/closed').valueChanges();
  }

}
}
