import { Component, effect, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
})
export class SearchInput {
  placeholder = input<string>('Buscar...');
  debounceTime = input<number>(500);
  initialValue = input<string>();

  value = output<string>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');
  
  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, this.debounceTime());

    onCleanup(() => clearTimeout(timeout));
  })
  
}
