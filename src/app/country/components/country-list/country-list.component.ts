import { Component, input } from '@angular/core';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { RESTCountry } from '../../interfaces/rest-country.interface';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe],
  templateUrl: './country-list.component.html',
})
export class CountryListComponent {
  countries = input.required<Country[]>();
}
