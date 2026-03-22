import { Component, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
})
export class SearchComponent {

  outputParam = output<string>();
  initialValue = input<string>();
  inputValue = linkedSignal(() => this.initialValue() ?? '')

}
