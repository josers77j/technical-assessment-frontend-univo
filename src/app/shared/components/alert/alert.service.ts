import { Injectable, signal } from '@angular/core';

export type AlertStateType = 'success' | 'error' | null

@Injectable({
  providedIn: 'root'
})
export class AlertService {

//TODO: implement a queue of alerts, but not now, maybe after finished the create and update section

  alertState = signal<AlertStateType>(null);
  alertMessage = signal<string>('');
  showSuccess(messageAlert: string){
    this.alertMessage.set(messageAlert)
    this.alertState.set('success');
    this.autoClear()
  }

   showError(messageAlert: string){
     this.alertMessage.set(messageAlert)
    this.alertState.set('error');
    this.autoClear()
  }

  clear(){
    this.alertState.set(null)
  }

  private autoClear(){
    setTimeout(() => {
      this.clear()
    }, 6000);
  }

}
