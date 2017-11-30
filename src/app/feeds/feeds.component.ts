import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
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
  prevKey: string[] = [];

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
  }



  safeurl(value) {
    return this.domSanitizer.bypassSecurityTrustUrl(value)
  }



}
