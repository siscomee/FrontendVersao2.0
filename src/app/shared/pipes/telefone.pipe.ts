import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'telefone' })
export class TelefonePipe implements PipeTransform {
  transform(valor: { toString: () => string }) {
    if (valor) {
      const value = valor.toString().replace(/\D/g, '');
      let valorFormatado = value + '';

      //+99(99)9999-99999
      if (value.length > 8)
        valorFormatado = value.replace(
          /(\d{2})(\d{2})(\d{4})(\d{1})/,
          '+$1($2)$3-$4'
        );
      else if (value.length > 4)
        valorFormatado = value.replace(/(\d{2})(\d{2})(\d{1})/, '+$1($2)$3');
      else if (value.length > 2)
        valorFormatado = value.replace(/(\d{2})(\d{1})/, '+$1($2');
      else if (value.length > 0)
        valorFormatado = value.replace(/(\d{1})/, '+$1');

      return valorFormatado;
    } else {
      return null;
    }
  }
}
