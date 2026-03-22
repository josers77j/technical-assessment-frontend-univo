import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AlertService } from '../../../../shared/components/alert/alert.service';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { ProviderService } from '../../../../providers/services/provider.service';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './product-detail-page.component.html',
})
export class ProductDetailPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly queryClient = inject(QueryClient);
  private readonly productService = inject(ProductService);
  private readonly providerService = inject(ProviderService);
  private readonly alertService = inject(AlertService);

  product = input<Product | undefined>();
  productId = input.required<number>();
  isEditMode = input.required<boolean>();

  productData: Product | null = null;
  formUtils = FormUtils;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: ['0', [Validators.required, Validators.min(0)]],
    description: [''],
    providerId: [0, [FormUtils.noSelected]],
    providerName: ['', [Validators.required]],
    sku: [''],
    stockQuantity: [0, [Validators.min(0)]],
    category: [''],
    dimensions: [''],
  });

  providersQuery = injectQuery(() => ({
    queryKey: ['providers-select'],
    queryFn: () =>
      firstValueFrom(this.providerService.getProviders(1, 200, null)),
    staleTime: 1000 * 60,
  }));

  fillFormEffect = effect(() => {
    const product = this.product();
    if (!product || !this.isEditMode()) return;

    this.productData = product;

    this.form.patchValue({
      name: product.name,
      price: product.price,
      description: product.description ?? '',
      providerId: Number(product.providerId ?? 0),
      providerName: product.provider?.name ?? '',
      sku: product.sku ?? '',
      stockQuantity: Number(product.stockQuantity ?? 0),
      category: product.category ?? '',
      dimensions: product.dimensions ?? '',
    });
  });

  syncProviderNameFromIdEffect = effect(() => {
    const providers = this.providersQuery.data()?.itemsArray ?? [];
    const providerId = Number(this.form.controls.providerId.value ?? 0);
    const providerName = (this.form.controls.providerName.value ?? '').trim();

    if (providers.length === 0 || providerId < 1 || providerName) return;

    const providerMatch = providers.find((item) => item.id === providerId);
    if (!providerMatch) return;

    this.form.patchValue(
      { providerName: providerMatch.name },
      { emitEvent: false },
    );

    const providerNameControl = this.form.controls.providerName;
    const currentErrors = providerNameControl.errors ?? {};
    const { invalidOption, ...restErrors } = currentErrors;
    providerNameControl.setErrors(
      Object.keys(restErrors).length ? restErrors : null,
    );
  });

  mutationSave = injectMutation(() => ({
    mutationFn: (payload: Record<string, unknown>) => {
      if (this.isEditMode()) {
        return firstValueFrom(
          this.productService.update(this.productId(), payload),
        );
      }

      return firstValueFrom(this.productService.create(payload));
    },
    onSuccess: async () => {
      this.queryClient.removeQueries({
        queryKey: ['product', this.productId()],
      });
      await this.queryClient.invalidateQueries({ queryKey: ['products'] });
      this.alertService.showSuccess('Producto guardado con éxito');
      this.router.navigate(['/products/list']);
    },
    onError: (exception) => {
      this.alertService.showError(`Error: ${exception.message}`);
    },
  }));

  onProviderInput(name: string) {
    const normalizedName = name.trim();
    const provider = this.providersQuery
      .data()
      ?.itemsArray.find(
        (item) => item.name.toLowerCase() === normalizedName.toLowerCase(),
      );

    this.form.patchValue({
      providerName: name,
      providerId: provider?.id ?? 0,
    });

    const providerNameControl = this.form.controls.providerName;
    const currentErrors = providerNameControl.errors ?? {};

    if (!normalizedName || provider) {
      const { invalidOption, ...restErrors } = currentErrors;
      providerNameControl.setErrors(
        Object.keys(restErrors).length ? restErrors : null,
      );
    } else {
      providerNameControl.setErrors({ ...currentErrors, invalidOption: true });
    }

    this.form.controls.providerId.markAsTouched();
    this.form.controls.providerId.updateValueAndValidity();
    providerNameControl.markAsTouched();
    providerNameControl.updateValueAndValidity();
  }

  onProviderBlur() {
    this.form.controls.providerName.markAsTouched();
    this.form.controls.providerId.markAsTouched();
    this.form.controls.providerId.updateValueAndValidity();
  }

  onSubmit() {
    this.onProviderInput(this.form.controls.providerName.value ?? '');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { providerName, ...payload } = this.form.getRawValue();
    const normalizedSku = (payload.sku ?? '').toString().trim();

    this.mutationSave.mutate({
      ...payload,
      price: String(this.form.value.price),
      stockQuantity: Number(this.form.value.stockQuantity ?? 0),
      providerId: Number(this.form.value.providerId ?? 0),
      sku: normalizedSku || null,
    });
  }

  isValidField(fieldName: string): boolean {
    return this.formUtils.isValidField(this.form, fieldName);
  }

  getFieldError(fieldName: string): string | null {
    return this.formUtils.getFieldError(this.form, fieldName);
  }
}
