import {
  Component,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input('Buscar');
  value = output<string>();
  debounceTime = input<number>(500);
  initialValue = input<string>('');

  // Señal interna para trackear el valor del input
  searchTerm = signal<string>('');

  // Effect para sincronizar initialValue con searchTerm
  private syncInitialValue = effect(() => {
    const initial = this.initialValue();
    if (initial && initial !== this.searchTerm()) {
      this.searchTerm.set(initial);
    }
  });

  // Effect con onCleanup para manejar el timeout de forma segura
  private debounceEffect = effect((onCleanup) => {
    const term = this.searchTerm();

    // Crear timeout para emitir después del debounce
    const timeoutId = setTimeout(() => {
      this.value.emit(term.trim());
    }, this.debounceTime());

    // Registrar función de limpieza que se ejecuta antes del siguiente run
    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  // Método para actualizar la señal cuando el input cambia
  onInputChange(value: string): void {
    this.searchTerm.set(value);
  }

  // Método para búsqueda inmediata (Enter o botón)
  onSearch(value: string): void {
    // Actualizar la señal disparará el effect, pero el onCleanup
    // cancelará el timeout pendiente automáticamente
    this.searchTerm.set(value);
    // Emitir inmediatamente sin esperar el debounce
    this.value.emit(value.trim());
  }
}
