import { TestBed } from '@angular/core/testing';
import { ConversionService } from './conversion.service';
import { CurrencyService } from './currency.service';
import { of, throwError } from 'rxjs';

describe('ConversionService', () => {
  let service: ConversionService;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CurrencyService', ['getConversionRate']);

    TestBed.configureTestingModule({
      providers: [
        ConversionService,
        { provide: CurrencyService, useValue: spy }
      ]
    });

    service = TestBed.inject(ConversionService);
    currencyServiceSpy = TestBed.inject(CurrencyService) as jasmine.SpyObj<CurrencyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert the amount correctly', () => {
    const mockRate = 0.85; // Example: USD to EUR
    const amount = 100;
    const fromCurrency = 'usd';
    const toCurrency = 'eur';
    const date = '2025-03-16';

    currencyServiceSpy.getConversionRate.and.returnValue(of({ usd: { eur: mockRate } }));

    service.convertAmount(date, amount, fromCurrency, toCurrency).subscribe(result => {
      expect(result).toBe("(as of 2025-03-16) 100 USD = 85.00 EUR");
    });
  });

  it('should handle errors from the currency service gracefully', () => {
    const amount = 100;
    const fromCurrency = 'usd';
    const toCurrency = 'eur';
    const date = '2025-03-16';

    currencyServiceSpy.getConversionRate.and.returnValue(throwError(() => new Error('Failed to fetch conversion rate')));

    service.convertAmount(date, amount, fromCurrency, toCurrency).subscribe(
      () => fail('Expected an error, but got a result'),
      error => {
        expect(error.message).toBe('Conversion failed: Failed to fetch conversion rate');
      }
    );
  });
});
