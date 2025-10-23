import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { Country } from '../interfaces/country.interface';
import { map, catchError } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    const trimmed = query?.trim();
    if (!trimmed) {
      return of([]);
    }
    return this.http
      .get<RESTCountry[]>(`${API_URL}/capital/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((resp) => CountryMapper.mapToCountries(resp)),
        catchError((error) => {
          console.error('[CountryService][searchByCapital] Error', {
            query: trimmed,
            status: error?.status,
            message: error?.message,
          });
          return of([]);
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const trimmed = query?.trim();
    if (!trimmed) {
      return of([]);
    }
    return this.http
      .get<RESTCountry[]>(`${API_URL}/name/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((resp) => CountryMapper.mapToCountries(resp)),
        catchError((error) => {
          console.error('[CountryService][searchByCountry] Error', {
            query: trimmed,
            status: error?.status,
            message: error?.message,
          });
          return of([]);
        })
      );
  }
}
