import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {
  private testSubject: Subject<any> = new Subject<string>();
  private warn: Subject<any> = new Subject<string>();

  constructor() {
    this.getObservable('test').subscribe((t) => {this.doAlert(t);});
  }

  public doAlert(thing: any){
    const warning = `${thing} clouds forecast!`;
    this.getSubject('warn').next(warning);
  }

  public getSubject(key: string): Subject<any>{
    if(key === 'test'){
      return this.testSubject;
    } else if(key === 'warn'){
      return this.warn;
    }
    return null;
  }

  public getObservable(key: string): Observable<any> {
    if(key === 'test'){
      return this.testSubject.asObservable();
    } else if(key === 'warn'){
      return this.warn.asObservable();
    }
    return null;
  }

}
