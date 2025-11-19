import {
  Component,
  input,
  output,
  linkedSignal,
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
  initialValue = input<string>();

  // linkedSignal se sincroniza automáticamente con initialValue al inicializar
  searchTerm = linkedSignal<string>(() => this.initialValue() ?? '');

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
}
