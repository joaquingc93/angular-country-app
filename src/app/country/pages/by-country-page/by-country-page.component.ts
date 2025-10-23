import { Component, inject, signal } from '@angular/core';
import { resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  private countryService = inject(CountryService);
  countryQuery = signal<string>('');

  countriesResource = resource<Country[], string>({
    params: () => this.countryQuery(),
    defaultValue: [],
    loader: async ({ params }) => {
      if (!params) return [];
      return firstValueFrom(this.countryService.searchByCountry(params));
    },
  });
}
