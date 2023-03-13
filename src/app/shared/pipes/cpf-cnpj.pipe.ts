import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfCnpj' })
export class CpfCnpjPipe implements PipeTransform {
  transform(valor: { toString: () => string }) {
    if (valor) {
      const value = valor.toString().replace(/\D/g, '');

      let valorFormatado = value + '';

      if (value.length > 12) {
        valorFormatado = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/,
          '$1.$2.$3/$4-$5'
        );
      } else if (value.length > 11) {
        valorFormatado = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{1})/,
          '$1.$2.$3/$4'
        );
      } else if (value.length > 9) {
        valorFormatado = value.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1})/,
          '$1.$2.$3-$4'
        );
      } else if (value.length > 6) {
        valorFormatado = value.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
      } else if (value.length > 3) {
        valorFormatado = value.replace(/(\d{3})(\d{1})/, '$1.$2');
      }

      return valorFormatado;
    } else {
      return null;
    }
  }
}
