import { Component, inject, signal } from '@angular/core';
import { resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { RESTCountry } from '../../interfaces/rest-country.interface';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  private countryService = inject(CountryService);

  // Signal para el término de búsqueda confirmado (submit)
  capitalQuery = signal<string>('');

  // Resource que carga países según la capital
  countriesResource = resource<Country[], string>({
    params: () => this.capitalQuery(),
    defaultValue: [],
    loader: async ({ params }) => {
      if (!params) return [];
      return firstValueFrom(this.countryService.searchByCapital(params));
    },
  });

  // Sin método onSearch: el template actualizará directamente capitalQuery
}
