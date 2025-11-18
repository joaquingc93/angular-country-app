import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { Region, REGIONS } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Validar y obtener el query param inicial
  private initialRegion = this.validateRegion(
    this.activatedRoute.snapshot.queryParamMap.get('region')
  );

  // Señal para la región seleccionada (inicializada con el query param validado)
  selectedRegion = signal<Region | ''>(this.initialRegion);

  /**
   * Valida que el query param sea una región válida
   */
  private validateRegion(region: string | null): Region | '' {
    if (!region) return '';

    // Verificar si el valor es una región válida
    const isValidRegion = REGIONS.includes(region as Region);
    return isValidRegion ? (region as Region) : '';
  }

  // Obtener lista de regiones del servicio
  regions = this.countryService.regions;

  // Effect para sincronizar el query param con la URL
  private syncQueryParam = effect(() => {
    const region = this.selectedRegion();

    // Actualizar la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: region ? { region } : {},
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  // rxResource para cargar países por región
  countriesResource = rxResource<Country[], Region | ''>({
    params: () => this.selectedRegion(),
    defaultValue: [],
    stream: ({ params }) => {
      if (!params) {
        return this.countryService.searchByRegion('Africa'); // región por defecto
      }
      return this.countryService.searchByRegion(params as Region);
    },
  });

  // Método para cambiar la región seleccionada
  onRegionChange(region: Region): void {
    this.selectedRegion.set(region);
  }
}
