import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { Country } from '../interfaces/country.interface';
import { Region, REGIONS } from '../interfaces/region.type';
import { map, catchError, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  // Lista de regiones disponibles (importada desde la constante)
  readonly regions = REGIONS;

  // Cachés separados por tipo de búsqueda
  private capitalCache = new Map<string, Country[]>();
  private countryCache = new Map<string, Country[]>();
  private alphaCodeCache = new Map<string, Country | null>();
  private regionCache = new Map<string, Country[]>();

  /**
   * Normaliza la query para usar como key en el caché
   */
  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  /**
   * Limpia todos los cachés
   */
  clearCache(): void {
    this.capitalCache.clear();
    this.countryCache.clear();
    this.alphaCodeCache.clear();
    this.regionCache.clear();
  }

  /**
   * Limpia el caché de un tipo específico
   */
  clearCacheByType(type: 'capital' | 'country' | 'alphaCode' | 'region'): void {
    switch (type) {
      case 'capital':
        this.capitalCache.clear();
        break;
      case 'country':
        this.countryCache.clear();
        break;
      case 'alphaCode':
        this.alphaCodeCache.clear();
        break;
      case 'region':
        this.regionCache.clear();
        break;
    }
  }

  searchByCapital(query: string): Observable<Country[]> {
    const trimmed = query?.trim();
    if (!trimmed) {
      return of([]);
    }

    // Normalizar query para el caché
    const cacheKey = this.normalizeQuery(trimmed);

    // Verificar si está en caché
    if (this.capitalCache.has(cacheKey)) {
      console.log(`[CountryService][searchByCapital] Cache HIT: "${cacheKey}"`);
      return of(this.capitalCache.get(cacheKey)!);
    }

    console.log(`[CountryService][searchByCapital] Cache MISS: "${cacheKey}"`);
    return this.http
      .get<RESTCountry[]>(`${API_URL}/capital/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((resp) => CountryMapper.mapToCountries(resp)),
        tap((countries) => {
          // Guardar en caché
          this.capitalCache.set(cacheKey, countries);
        }),
        catchError((error) => {
          console.error('[CountryService][searchByCapital] Error', {
            query: trimmed,
            status: error?.status,
            message: error?.message,
          });
          // También cachear resultados vacíos para evitar reintentos
          this.capitalCache.set(cacheKey, []);
          return of([]);
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const trimmed = query?.trim();
    if (!trimmed) {
      return of([]);
    }

    // Normalizar query para el caché
    const cacheKey = this.normalizeQuery(trimmed);

    // Verificar si está en caché
    if (this.countryCache.has(cacheKey)) {
      console.log(`[CountryService][searchByCountry] Cache HIT: "${cacheKey}"`);
      return of(this.countryCache.get(cacheKey)!);
    }

    console.log(`[CountryService][searchByCountry] Cache MISS: "${cacheKey}"`);
    return this.http
      .get<RESTCountry[]>(`${API_URL}/name/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((resp) => CountryMapper.mapToCountries(resp)),
        tap((countries) => {
          // Guardar en caché
          this.countryCache.set(cacheKey, countries);
        }),
        catchError((error) => {
          console.error('[CountryService][searchByCountry] Error', {
            query: trimmed,
            status: error?.status,
            message: error?.message,
          });
          // También cachear resultados vacíos para evitar reintentos
          this.countryCache.set(cacheKey, []);
          return of([]);
        })
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const trimmed = code?.trim();
    if (!trimmed) {
      return of(null);
    }

    // Normalizar código para el caché (alpha codes son case-insensitive)
    const cacheKey = this.normalizeQuery(trimmed);

    // Verificar si está en caché
    if (this.alphaCodeCache.has(cacheKey)) {
      console.log(
        `[CountryService][searchCountryByAlphaCode] Cache HIT: "${cacheKey}"`
      );
      return of(this.alphaCodeCache.get(cacheKey)!);
    }

    console.log(
      `[CountryService][searchCountryByAlphaCode] Cache MISS: "${cacheKey}"`
    );
    return this.http
      .get<RESTCountry[]>(`${API_URL}/alpha/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((resp) => {
          // La API devuelve un array, tomamos el primer elemento
          const countries = CountryMapper.mapToCountries(resp);
          return countries.length > 0 ? countries[0] : null;
        }),
        tap((country) => {
          // Guardar en caché
          this.alphaCodeCache.set(cacheKey, country);
        }),
        catchError((error) => {
          console.error('[CountryService][searchCountryByAlphaCode] Error', {
            code: trimmed,
            status: error?.status,
            message: error?.message,
          });
          // También cachear resultados null para evitar reintentos
          this.alphaCodeCache.set(cacheKey, null);
          return of(null);
        })
      );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    // Normalizar región para el caché
    const cacheKey = this.normalizeQuery(region);

    // Verificar si está en caché
    if (this.regionCache.has(cacheKey)) {
      console.log(`[CountryService][searchByRegion] Cache HIT: "${cacheKey}"`);
      return of(this.regionCache.get(cacheKey)!);
    }

    console.log(`[CountryService][searchByRegion] Cache MISS: "${cacheKey}"`);
    return this.http
      .get<RESTCountry[]>(`${API_URL}/region/${encodeURIComponent(region)}`)
      .pipe(
        map((resp) => CountryMapper.mapToCountries(resp)),
        tap((countries) => {
          // Guardar en caché
          this.regionCache.set(cacheKey, countries);
        }),
        catchError((error) => {
          console.error('[CountryService][searchByRegion] Error', {
            region,
            status: error?.status,
            message: error?.message,
          });
          // También cachear resultados vacíos para evitar reintentos
          this.regionCache.set(cacheKey, []);
          return of([]);
        })
      );
  }
}
