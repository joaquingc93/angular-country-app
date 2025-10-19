import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { Country } from '../interfaces/country.interface';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    return this.http
      .get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(map((resp) => CountryMapper.mapToCountries(resp)));
  }
}
