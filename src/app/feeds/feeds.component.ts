import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Report } from '../models/report';



@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {

  feeds: Observable<any[]>;
  picUrl: any[] = [];
  report: Report;
  postsPrefix: string[] = [];
  postTobeClosed: any;
  date: string = new Date().toLocaleString();
  reportClosed: boolean;
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
      this.feeds = this.afdb.list('report/open').valueChanges();
      this.afdb.list('report/open').snapshotChanges().subscribe(res => {
        res.forEach(feed => {
          this.postsPrefix.push(feed.key);
        });
      });
    }
  }
  fix(postID: any) {
    const itemRef = this.afdb.object('report/closed/' + this.postsPrefix[postID]);
    try {
      this.afdb.object('report/open/' + this.postsPrefix[postID]).valueChanges().
        subscribe(res => itemRef.update(res).then(_ =>
          console.log('Reported issues closed!'))
        );
      this.report = new Report;
      this.report.fix_date = this.date;
      itemRef.update(this.report);
      this.toRemove(postID);
    } catch (error) {
      console.log('sth wrong!');

    }
  }

  toRemove(postID) {
    this.afdb.list('report/open/' + this.postsPrefix[postID]).remove().then(_ => console.log('feeds removed'));
  }


}
