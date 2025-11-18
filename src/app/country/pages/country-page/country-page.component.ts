import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';

import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';

@Component({
  selector: 'app-country-page',
  imports: [DecimalPipe, RouterLink, NotFoundComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  private route = inject(ActivatedRoute);
  private countryService = inject(CountryService);

  // Convertir los params de la ruta en una señal
  private params = toSignal(this.route.params);

  // Señal computada para obtener el código del país
  private countryCode = computed(() => {
    const params = this.params();
    return params?.['code'] ?? '';
  });

  // rxResource para obtener la información del país
  countryResource = rxResource<Country | null, string>({
    params: () => this.countryCode(),
    defaultValue: null,
    stream: ({ params }) =>
      this.countryService.searchCountryByAlphaCode(params),
  });
}
