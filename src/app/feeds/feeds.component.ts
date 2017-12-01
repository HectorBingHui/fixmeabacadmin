import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { DomSanitizer } from '@angular/platform-browser';
import { Report } from '../models/report';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}

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

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.feeds = this.afdb.list('report/open').valueChanges();
    this.afdb.list('report/open').snapshotChanges().subscribe(res => {
      res.forEach(feed => {
        this.postsPrefix.push(feed.key);
      });
    });
    console.log(this.postsPrefix);
  }

  fix(postID: any) {
    const itemRef = this.afdb.object('report/closed/' + this.postsPrefix[postID]);
    try {
      this.afdb.list('report/open/' + this.postsPrefix[postID]).valueChanges().
        subscribe(res => itemRef.update(res).then(_ =>
          console.log('Reported issues closed!'))
        );
      this.toRemove(postID);
    } catch (error) {
      console.log('sth wrong!');

    }
  }

  toRemove(postID) {
    this.afdb.list('report/open/' + this.postsPrefix[postID]).remove();
  }


}
