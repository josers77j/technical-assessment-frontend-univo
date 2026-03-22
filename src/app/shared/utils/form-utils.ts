import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  static readonly emailPattern = String.raw`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`;

  static getTextError(errors: ValidationErrors) {
    const key = Object.keys(errors)[0];

    if (!key) return null;

    switch (key) {
      case 'required':
        return 'Este campo es requerido';

      case 'minlength':
        return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;

      case 'maxlength':
        return `Maximo de ${errors['maxlength'].requiredLength} caracteres.`;

      case 'min':
        return `Valor minimo de ${errors['min'].min}`;

      case 'email':
        return 'El valor ingresado no es un correo electronico';

      case 'noSelected':
        return 'Es necesario elegir una opcion';

      case 'mustBeANumber':
        return 'El campo debe contener numeros solamente';

      case 'invalidOption':
        return 'Debes seleccionar un proveedor valido de la lista';

      case 'pattern':
        if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
          return 'El valor ingresado no luce como un correo electronico';
        }

        return 'Error de patron contra expresion regular';

      default:
        return `Error de validacion no controlado ${key}`;
    }
  }

  static isValidField(form: FormGroup, fieldName: string): boolean {
    return (
      !!form.controls[fieldName]?.errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      !!formArray.controls[index]?.errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number,
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static noSelected(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    return value < 1 ? { noSelected: true } : null;
  }

  static mustBeANumber(control: AbstractControl): ValidationErrors | null {
    const isNotNumber = Number.isNaN(+control.value);

    return isNotNumber ? { mustBeANumber: true } : null;
  }
}
