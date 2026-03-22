import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { Provider } from '../../interfaces/provider.interface';

@Component({
  selector: 'provider-table',
  imports: [DatePipe, RouterLink, SkeletonComponent],
  templateUrl: './provider-table.component.html',
})
export class ProviderTableComponent {
  providers = input<Provider[]>([]);
  isLoading = input<boolean>(false);
  skeletonLimit = input<number>(10);

  deleteClicked = output<number>();

  onDelete(id: number) {
    this.deleteClicked.emit(id);
  }
}
