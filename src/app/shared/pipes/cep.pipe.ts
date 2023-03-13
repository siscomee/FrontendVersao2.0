import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cep' })
export class CepPipe implements PipeTransform {
  transform(valor: { toString: () => string }) {
    if (valor) {
      const value = valor.toString().replace(/\D/g, '');
      let valorFormatado = value + '';

      if (value.length > 5)
        valorFormatado = value.replace(/(\d{5})(\d{1})/, '$1-$2');

      return valorFormatado;
    } else {
      return null;
    }
  }
}
