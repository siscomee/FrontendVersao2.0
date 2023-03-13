import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedorComponent } from './adm-cadastrar/fornecedor/fornecedor.component';
import { RamoSetorComponent } from './adm-cadastrar/ramo-setor/ramo-setor.component';
import { ProdutoComponent } from './adm-cadastrar/produto/produto.component';
import { TipoDeProdutoComponent } from './adm-cadastrar/tipo-de-produto/tipo-de-produto.component';
import { CategoriaComponent } from './adm-cadastrar/categoria/categoria.component';
import { FichaTecnicaComponent } from './adm-cadastrar/ficha-tecnica/ficha-tecnica.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'fornecedor',
    component: FornecedorComponent,
  },
  {
    path: 'produto',
    component: ProdutoComponent,
  },
  {
    path: 'ramo-setor',
    component: RamoSetorComponent,
  },
  {
    path: 'tipo-de-produto',
    component: TipoDeProdutoComponent,
  },
  {
    path: 'categoria',
    component: CategoriaComponent,
  },
  {
    path: 'ficha-tecnica',
    component: FichaTecnicaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodyRoutingModule {}
