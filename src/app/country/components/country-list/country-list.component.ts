import { Component, input } from '@angular/core';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RESTCountry } from '../../interfaces/rest-country.interface';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './country-list.component.html',
})
export class CountryListComponent {
  countries = input.required<Country[]>();
}
