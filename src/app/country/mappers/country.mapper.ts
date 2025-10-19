import { RESTCountry } from '../interfaces/rest-country.interface';
import { Country } from '../interfaces/country.interface';

export class CountryMapper {
  // Convierte un objeto RESTCountry (API v3.1) a nuestro modelo simplificado Country
  static mapToCountry(rest: RESTCountry): Country {
    return {
      cca2: rest.cca2,
      flag: rest.flag, // Emoji
      flagSvg: rest.flags?.svg ?? '',
      name: rest.translations['spa'].common ?? '',
      capital: rest.capital?.[0] ?? '',
      population: rest.population ?? 0,
    };
  }

  // Convierte un arreglo de RESTCountry[] a Country[]
  static mapToCountries(list: RESTCountry[] = []): Country[] {
    return list.map(CountryMapper.mapToCountry);
  }
}
