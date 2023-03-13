import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastComponent } from './../shared/toast/toast.component';
import { SharedModule } from './../shared/shared.module';
import { BodyRoutingModule } from './body.routing';
import { HomeComponent } from './home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { RamoSetorComponent } from './adm-cadastrar/ramo-setor/ramo-setor.component';
import { RamoSetorModalComponent } from './adm-cadastrar/ramo-setor/ramo-setor-modal/ramo-setor-modal.component';
import { FornecedorComponent } from './adm-cadastrar/fornecedor/fornecedor.component';
import { FornecedorModalComponent } from './adm-cadastrar/fornecedor/fornecedor/fornecedor-modal.component';
import { ProdutoComponent } from './adm-cadastrar/produto/produto.component';
import { ProdutoModalComponent } from './adm-cadastrar/produto/produto-modal/produto-modal.component';
import { TipoDeProdutoComponent } from './adm-cadastrar/tipo-de-produto/tipo-de-produto.component';
import { TipoDeProdutoModalComponent } from './adm-cadastrar/tipo-de-produto/tipo-de-produto-modal/tipo-de-produto-modal.component';
import { CategoriaComponent } from './adm-cadastrar/categoria/categoria.component';
import { CategoriaModalComponent } from './adm-cadastrar/categoria/categoria/categoria-modal.component';
import { FichaTecnicaComponent } from './adm-cadastrar/ficha-tecnica/ficha-tecnica.component';
import { FichaTecnicaModalComponent } from './adm-cadastrar/ficha-tecnica/ficha-tecnica/ficha-tecnica-modal/ficha-tecnica-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    FornecedorComponent,
    FornecedorModalComponent,
    ProdutoComponent,
    ProdutoModalComponent,
    RamoSetorComponent,
    RamoSetorModalComponent,
    TipoDeProdutoComponent,
    TipoDeProdutoModalComponent,
    CategoriaComponent,
    CategoriaModalComponent,
    FichaTecnicaComponent,
    FichaTecnicaModalComponent,
  ],
  imports: [
    CommonModule,
    BodyRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    OrderModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  bootstrap: [ToastComponent],
})
export class BodyModule {}
