import { FichaTecnica } from './ficha-tecnica';

export interface ResultadoFichaTecnicaForm {
  record: FichaTecnica;
  tipoCrud: string;
  status: boolean;
}
