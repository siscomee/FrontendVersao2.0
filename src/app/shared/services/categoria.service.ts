import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { Categoria } from '../models/categoria';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends CrudService<Categoria> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}categoria`, mensagem);
  }

  unicidade(param: string, id: number | null) {
    let params = new HttpParams();
    params = param
      ? params.set('nmCategoria', param)
      : params.set('nmCategoria', '');
    return this.http
      .get<Categoria[]>(`${environment.API}categoria/unicidade`, {
        params,
      })
      .pipe(
        tap(console.log),
        map((dados: { nmCategoria: string; id: number }[]) =>
          dados.filter((v) => v.id != id && v.nmCategoria == param)
        ),
        tap(console.log),
        map((dados: any[]) => dados.length > 0),
        tap(console.log)
      );
  }
}
