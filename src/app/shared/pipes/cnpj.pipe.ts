import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {
  transform(valor: { toString: () => string }) {
    if (valor) {
      const value = valor.toString().replace(/\D/g, '');

      let valorFormatado = value + '';

      //XX.XXX.XXX/XXXX-XX

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
      } else if (value.length > 8) {
        valorFormatado = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{1})/,
          '$1.$2.$3/$4'
        );
      } else if (value.length > 5) {
        valorFormatado = value.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2.$3');
      } else if (value.length > 2) {
        valorFormatado = value.replace(/(\d{2})(\d{1})/, '$1.$2');
      }

      return valorFormatado;
    } else {
      return null;
    }
  }
}
