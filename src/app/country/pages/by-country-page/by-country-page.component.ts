import { Component, inject, signal, effect } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Obtener el query param inicial
  private initialQuery =
    this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  // Signal para el término de búsqueda (inicializado con el query param)
  countryQuery = signal<string>(this.initialQuery);

  // Effect para sincronizar el query param con la URL
  private syncQueryParam = effect(() => {
    const query = this.countryQuery();

    // Actualizar la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: query ? { query } : {},
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  countriesResource = rxResource<Country[], string>({
    params: () => this.countryQuery(),
    defaultValue: [],
    stream: ({ params }) => {
      if (!params) {
        return this.countryService.searchByCountry('');
      }
      return this.countryService.searchByCountry(params);
    },
  });
}
