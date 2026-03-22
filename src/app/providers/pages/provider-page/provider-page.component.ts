import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProviderService } from '../../services/provider.service';
import { ProviderDetailPageComponent } from './provider-detail-page/provider-detail-page.component';

@Component({
  selector: 'app-provider-page.component',
  imports: [ProviderDetailPageComponent, AlertComponent],
  templateUrl: './provider-page.component.html',
})
export class ProviderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly providerService = inject(ProviderService);

  providerId = computed(() =>
    Number(this.route.snapshot.paramMap.get('id') ?? 0),
  );
  isEditMode = computed(() => this.providerId() > 0);

  providerQuery = injectQuery(() => ({
    queryKey: ['provider', this.providerId()],
    queryFn: () =>
      firstValueFrom(this.providerService.getProviderById(this.providerId())),
    staleTime: 1000 * 60,
  }));
}
