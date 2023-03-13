import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpf' })
export class CpfPipe implements PipeTransform {
  transform(cpf: { toString: () => string }) {
    if (cpf) {
      const value = cpf.toString().replace(/\D/g, '');

      let cpfFormatado = value + '';

      if (value.length > 9) {
        cpfFormatado = value.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1})/,
          '$1.$2.$3-$4'
        );
      } else if (value.length > 6) {
        cpfFormatado = value.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
      } else if (value.length > 3) {
        cpfFormatado = value.replace(/(\d{3})(\d{1})/, '$1.$2');
      }

      return cpfFormatado;
    } else {
      return null;
    }
  }
}
