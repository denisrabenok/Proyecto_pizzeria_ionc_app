import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

/*
  Generated class for the HttpRequestProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpRequestProvider {

  constructor(public http: HttpClient , public Http: Http)  {
  }

  public post(url : string , data : any){
    return new Promise((resolve, reject) => {
      this.Http.post(url, data)
        .retryWhen(error => error.delay(20000))
        .timeout(40000) 
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log("Error retry");
          reject(err);
        });
    });
    
  }

  public get(url : string){
    return new Promise((resolve, reject) => {
      this.Http.get(url)
        .retryWhen(error => error.delay(2000))
        .timeout(6000)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log("Error Retry");
          reject(err);
        });
    });
    
  }

}
