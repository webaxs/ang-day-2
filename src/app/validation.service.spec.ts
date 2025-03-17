import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService]
    });
    service = TestBed.inject(ValidationService);
  });

  describe('currencySelectionValidator', () => {
    it('should return null if currencies are different', () => {
      const formGroup = new FormGroup({
        currencyFrom: new FormControl('USD'),
        currencyTo: new FormControl('EUR')
      });
      expect(service.currencySelectionValidator(formGroup)).toBeNull();
    });

    it('should return { sameCurrency: true } if currencies are the same', () => {
      const formGroup = new FormGroup({
        currencyFrom: new FormControl('USD'),
        currencyTo: new FormControl('USD')
      });
      expect(service.currencySelectionValidator(formGroup)).toEqual({ sameCurrency: true });
    });
  });

  describe('validateDateNotFuture', () => {
    it('should return null if date is today or in the past', () => {
      const today = new Date().toISOString().split('T')[0];
      const pastDate = new Date('2020-01-01').toISOString().split('T')[0];

      expect(service.validateDateNotFuture(new FormControl(today))).toBeNull();
      expect(service.validateDateNotFuture(new FormControl(pastDate))).toBeNull();
    });

    it('should return { futureDate: true } if date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
      const formattedDate = futureDate.toISOString().split('T')[0];

      expect(service.validateDateNotFuture(new FormControl(formattedDate))).toEqual({ futureDate: true });
    });
  });
});
