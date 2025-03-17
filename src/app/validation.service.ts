import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // Ensure "From" and "To" currencies are not the same
  currencySelectionValidator(group: AbstractControl): ValidationErrors | null {
    const currencyFrom = group.get('currencyFrom')?.value;
    const currencyTo = group.get('currencyTo')?.value;

    return currencyFrom && currencyTo && currencyFrom === currencyTo ? { sameCurrency: true } : null;
  }

  // Ensure date is not in the future
  validateDateNotFuture(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value ? new Date(control.value) : null;
    const today = new Date();

    return selectedDate && selectedDate > today ? { futureDate: true } : null;
  }
}
