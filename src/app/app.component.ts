import {CommonModule, DatePipe} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {CurrencyService} from './currency.service';
import {ConversionService} from './conversion.service';
import {ValidationService} from './validation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myForm: FormGroup;
  currencies: string[] = [];
  responseMessage = '';
  errorMessage = '';
  conversionResult: string = '';

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private conversionService: ConversionService,
    private validationService: ValidationService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.myForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currencyFrom: ['', Validators.required],
      currencyTo: ['', Validators.required],
      date: ['', [Validators.required, this.validationService.validateDateNotFuture.bind(this.validationService)]]
    }, { validators: this.validationService.currencySelectionValidator.bind(this.validationService) });
  }

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        // Assuming the response is an object with currency codes as keys
        this.currencies = Object.keys(data);
      },
      (error) => {
        console.error('Error fetching currencies:', error);
      }
    );
  }

  onSubmit() {
    if (this.myForm.valid) {
      const { amount, currencyFrom, currencyTo, date } = this.myForm.value;
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      if (!formattedDate) {
        this.errorMessage = 'Invalid date format.';
        this.conversionResult = '';
        return;
      }

      this.conversionService.convertAmount(formattedDate, amount, currencyFrom, currencyTo).subscribe(
        (result) => {
          this.conversionResult = result;
          this.errorMessage = '';
          this.snackBar.open('Conversion successful!', 'Close', { duration: 3000 });
        },
        (error) => {
          this.errorMessage = error.message;
          this.conversionResult = '';
        }
      );
    }
  }



}
