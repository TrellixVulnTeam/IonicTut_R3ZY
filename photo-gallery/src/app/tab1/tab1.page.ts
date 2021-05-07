import {Component} from '@angular/core';
import {EventManagerService} from '../services/event-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public messages: string[] = [];
  public flameState = 'flame-outline';
  public warning: string = null;

  constructor(private eventMan: EventManagerService) {
    this.eventMan.getObservable('warn').subscribe((w: string) =>{this.showWarning(w);});
  }

  public clearWarning(): void{
    this.warning = null;
  }

  public log() {
    this.messages.push('whack, ');
  }

  public toggleFlameState(state: string) {
    if (state === 'flame') {
      this.flameState = 'flame-outline';
    } else {
      this.flameState = 'flame';
    }
  }

  public alertClouds(value: string | number) {
    if(value != null) {
      let sendMe = '';
      if(this.flameState === 'flame'){
        sendMe = 'flaming ';
      }
      this.eventMan.getSubject('test').next(sendMe + value);
    }
  }

  private showWarning(warn: string){
    //alert(`Got Warning: ${warn}`);
    this.warning = warn;
  }

}
