import { Component, computed, inject, signal } from '@angular/core';
import { AlertService } from './alert.service';
import { ALERT_STATE } from '../../consts/alert-state.const';


@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',

})
export class AlertComponent {
  alertService = inject(AlertService)
  ALERT_STATE = ALERT_STATE;
  alertState = computed(()=> this.alertService.alertState())
  alertMessage = computed(()=> this.alertService.alertMessage())

  alertClass = computed(()=> {
    return  this.alertStyle()[this.alertState()!]
  })

  alertStyle = signal({
    success: 'alert-success',
    error: 'alert-error'
  })

}
