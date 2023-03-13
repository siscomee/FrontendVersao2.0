export interface FichaTecnica {
  id: number;
  nmFichaTecnica: string;
  tempoPreparo: number;
  dtCriacao: Date;
  dtValidade: Date;
  dsIngredientes: string;
  qtdBruta: number;
  txDesperdicio: number;
  qtdLiquida: number;
  dsModoPreparo: string;
  dsObservacao: string;
  inAtivo: any;
  usuarioIdAtualiza: number;
  dtUltAtualiza: Date;
  tipoProdutoId: number;
  dsTipoProduto: number;
  categoriaId: number;
  nmCategoria: string;
}
