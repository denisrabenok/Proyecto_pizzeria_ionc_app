import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

let apiUrl = 'http://navi.pythonanywhere.com/rest/';

@Injectable()
export class AuthServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  postData(credentials, tipo){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      console.log(credentials);
      this.http.post(apiUrl+tipo, credentials, {headers:headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });    
  });
  }
}
