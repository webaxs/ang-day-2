import { Injectable } from '@angular/core';
import { CurrencyService } from './currency.service';
import {Observable, map, catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  constructor(private currencyService: CurrencyService) { }

  convertAmount(date: string, amount: number, currencyFrom: string, currencyTo: string): Observable<string> {
    return this.currencyService.getConversionRate(date, currencyFrom).pipe(
      map(response => {
        const conversionRate = response[currencyFrom]?.[currencyTo];

        const convertedAmount = amount * conversionRate;

        return `(as of ${date}) ${amount} ${currencyFrom.toUpperCase()} = ${convertedAmount.toFixed(2)} ${currencyTo.toUpperCase()}`;
      }),
      catchError(error => {
        // If `currencyService.getConversionRate` throws an error, handle it here
        return throwError(() => new Error(`Conversion failed: ${error.message}`));
      })
    );
  }
}
