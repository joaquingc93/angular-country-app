import { Component, inject, signal, effect } from '@angular/core';
import { resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { RESTCountry } from '../../interfaces/rest-country.interface';
import { Country } from '../../interfaces/country.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Obtener el query param inicial
  private initialQuery =
    this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  // Signal para el término de búsqueda (inicializado con el query param)
  capitalQuery = signal<string>(this.initialQuery);

  // Effect para sincronizar el query param con la URL
  private syncQueryParam = effect(() => {
    const query = this.capitalQuery();

    // Actualizar la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: query ? { query } : {},
      queryParamsHandling: 'merge',
      replaceUrl: true, // No agregar entrada al historial
    });
  });

  // Resource que carga países según la capital
  countriesResource = rxResource<Country[], string>({
    params: () => this.capitalQuery(),
    defaultValue: [],
    stream: ({ params }) => {
      if (!params) {
        // devolver un observable de array vacío
        return this.countryService.searchByCapital(''); // service maneja vacío devolviendo []
      }
      return this.countryService.searchByCapital(params);
    },
  });
}
