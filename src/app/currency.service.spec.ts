import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';


describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch currency list', () => {
    const mockCurrencies = { usd: 'United States Dollar', eur: 'Euro' };

    service.getCurrencies().subscribe(data => {
      expect(data).toEqual(mockCurrencies);
    });

    const req = httpMock.expectOne(service['allCurrenciesUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCurrencies);
  });

  it('should fetch conversion rates', () => {
    const mockRates = { usd: { eur: 0.85 } };
    const date = '2025-03-16';
    const currencyFrom = 'usd';

    service.getConversionRate(date, currencyFrom).subscribe(data => {
      expect(data).toEqual(mockRates);
    });

    const req = httpMock.expectOne(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${currencyFrom}.json`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRates);
  });

  it('should handle HTTP errors', () => {
    service.getCurrencies().subscribe(
      () => fail('Expected error, but got success'),
      error => {
        expect(error.message).toBe('Data not found: The requested resource does not exist');
      }
    );

    const req = httpMock.expectOne(service['allCurrenciesUrl']);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

});
