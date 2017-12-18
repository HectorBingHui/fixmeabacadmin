import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Report } from '../models/report';
import { User } from '../user';



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
  openReportNo: any = 0 ;
  totalReportNo: any = 0 ;
  closedReportNo: any = 0 ;
  user: firebase.User;
  addUser: User;


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
    this.user = this.afAuth.auth.currentUser;
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
    const message = window.confirm('Are you sure you want to close this issue?');
    if (message === true) {
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
        this.addUserStat();
      } catch (error) {
        console.log('sth wrong!');

      }

    } else {
      console.log('User cancel selection');
    }
  }

  toRemove(postID) {
    this.afdb.list('report/open/' + this.postsPrefix[postID]).remove().then(_ => console.log('feeds removed'));
  }


  addUserStat() {
    this.addUser = new User;
    const userRef = this.afdb.object('user/' + this.user.uid);
    this.afdb.list('user/' + this.user.uid).valueChanges().subscribe(res => {
      this.closedReportNo = res[0];
      this.openReportNo = res[3];
      this.totalReportNo = res[5];
      this.addUser.openNo = Number(this.openReportNo) - 1 ;
      this.addUser.closeNo = Number(this.closedReportNo)  + 1;
      this.totalReportNo = Number(this.addUser.openNo + this.addUser.closeNo) ;
      this.addUser.reportNo = this.totalReportNo;
      userRef.update(this.addUser);
    });
  }


}
