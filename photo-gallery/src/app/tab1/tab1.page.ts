import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public messages: string[] = [];
	public flameState: string = "flame-outline";
	constructor() {
	}

	public log(){
		this.messages.push("whack, ");
	}

	public toggleFlameState(state: string){
		//alert(`currentState = ${this.flameState}, incomming = ${state}`);
		if(state === "flame"){
			this.flameState = "flame-outline";
		} else {
			this.flameState = "flame";
		}
	}
	

}
