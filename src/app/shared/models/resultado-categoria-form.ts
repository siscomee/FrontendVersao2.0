import { Categoria } from './categoria';

export interface ResultadoCategoriaForm {
  record: Categoria;
  tipoCrud: string;
  status: boolean;
}
