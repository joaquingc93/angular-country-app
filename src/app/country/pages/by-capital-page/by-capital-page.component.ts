import { Component, inject, signal } from '@angular/core';
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
  countryService = inject(CountryService);
  isLoading = signal(false);
  countries = signal<Country[]>([]);

  onSearch(value: string) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.countryService.searchByCapital(value).subscribe((response) => {
      this.isLoading.set(false);
      this.countries.set(response);
    });
  }
}
