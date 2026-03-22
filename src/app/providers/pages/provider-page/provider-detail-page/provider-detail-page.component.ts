import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../../../shared/components/alert/alert.service';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { Provider } from '../../../interfaces/provider.interface';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-provider-detail-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './provider-detail-page.component.html',
})
export class ProviderDetailPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly queryClient = inject(QueryClient);
  private readonly providerService = inject(ProviderService);
  private readonly alertService = inject(AlertService);

  provider = input<Provider | undefined>();
  providerId = input.required<number>();
  isEditMode = input.required<boolean>();

  providerData: Provider | null = null;
  formUtils = FormUtils;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: [''],
    phone: [''],
    description: [''],
  });

  fillFormEffect = effect(() => {
    const provider = this.provider();
    if (!provider || !this.isEditMode()) return;

    this.providerData = provider;

    this.form.patchValue({
      name: provider.name,
      address: provider.address ?? '',
      phone: provider.phone ?? '',
      description: provider.description ?? '',
    });
  });

  mutationSave = injectMutation(() => ({
    mutationFn: (payload: Record<string, unknown>) => {
      if (this.isEditMode()) {
        return firstValueFrom(
          this.providerService.update(this.providerId(), payload),
        );
      }

      return firstValueFrom(this.providerService.create(payload));
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['providers'] });
      this.queryClient.invalidateQueries({
        queryKey: ['provider', this.providerId()],
      });
      this.alertService.showSuccess('Proveedor guardado con éxito');
      this.router.navigate(['/providers/list']);
    },
    onError: (exception) => {
      this.alertService.showError(`Error: ${exception.message}`);
    },
  }));

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.mutationSave.mutate(this.form.getRawValue());
  }

  isValidField(fieldName: string): boolean {
    return this.formUtils.isValidField(this.form, fieldName);
  }

  getFieldError(fieldName: string): string | null {
    return this.formUtils.getFieldError(this.form, fieldName);
  }
}
