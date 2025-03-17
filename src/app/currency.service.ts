import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private allCurrenciesUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'; // Currency API URL
  private currencyRatesUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/{currencyFrom}.json';


  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<any> {
    return this.http.get<any>(this.allCurrenciesUrl).pipe(
      catchError(this.handleError)
    );
  }

  getConversionRate(date: string, currencyFrom: string): Observable<any> {
    const url = this.currencyRatesUrl.replace('{date}', date).replace('{currencyFrom}', currencyFrom);
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 0) {
      errorMessage = 'Network error: Unable to connect to the server';
    } else if (error.status === 400) {
      errorMessage = 'Bad Request: Invalid input provided';
    } else if (error.status === 404) {
      errorMessage = 'Data not found: The requested resource does not exist';
    } else if (error.status >= 500) {
      errorMessage = 'Server error: Please try again later';
    }

    return throwError(() => new Error(errorMessage));
  }
}
