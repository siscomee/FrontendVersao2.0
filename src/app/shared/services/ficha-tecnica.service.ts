import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';
import { FichaTecnica } from '../models/ficha-tecnica';

@Injectable({
  providedIn: 'root',
})
export class FichaTecnicaService extends CrudService<FichaTecnica> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}fichaTecnica`, mensagem);
  }

  listarTipos() {
    return this.http
      .get<FichaTecnica[]>(`${environment.API}fichaTecnica/tipoDeProdutos`)
      .pipe(delay(500), tap(console.log));
  }

  listarCategorias() {
    return this.http
      .get<FichaTecnica[]>(`${environment.API}fichaTecnica/categorias`)
      .pipe(delay(500), tap(console.log));
  }

  unicidade(
    idTipoDeProduto: Number,
    idCategoria: Number,
    nmFichaTecnica: String,
    idFichaTecnica: Number
  ) {
    return this.http
      .get<FichaTecnica[]>(
        `${environment.API}fichaTecnica/unicidade/` +
          idTipoDeProduto +
          '/' +
          idCategoria +
          '/' +
          nmFichaTecnica +
          '/' +
          idFichaTecnica
      )
      .pipe(tap(console.log));
  }

  inativar(id: any) {
    return this.http
      .get<FichaTecnica[]>(`${environment.API}fichaTecnica/inativar/` + id)
      .pipe(tap(console.log));
  }

  filtrar(
    idTipoDeProduto: Number,
    idCategoria: Number,
    nmFichaTecnica: String,
    situacao: String
  ) {
    let nmFichaTecnicaDs = nmFichaTecnica != '' ? nmFichaTecnica : 'nulo';

    return this.http
      .get<FichaTecnica[]>(
        `${environment.API}fichaTecnica/filtrar/` +
          idTipoDeProduto +
          '/' +
          idCategoria +
          '/' +
          nmFichaTecnicaDs +
          '/' +
          situacao
      )
      .pipe(delay(1000), tap(console.log));
  }
}
