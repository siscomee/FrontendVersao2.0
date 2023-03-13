import { ResultadoProdutoForm } from '../../../shared/models/resultado-produto-form';
import { Router } from '@angular/router';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidator } from './../../../shared/form-validator';
import { FichaTecnicaService } from '../../../shared/services/ficha-tecnica.service';
import { FichaTecnicaModalComponent } from './ficha-tecnica/ficha-tecnica-modal/ficha-tecnica-modal.component';
import { FichaTecnica } from 'src/app/shared/models/ficha-tecnica';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';
import { Categoria } from 'src/app/shared/models/categoria';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ficha-tecnica',
  templateUrl: './ficha-tecnica.component.html',
  styleUrls: ['./ficha-tecnica.component.css'],
})
export class FichaTecnicaComponent implements OnInit {
  fileName = 'fichas_tecnicas.xlsx';
  public listaExcel: Boolean = false;
  title: string = 'Ficha Técnica';

  paginaAtual: number = 1;
  key: string = 'InAtivo';
  reverse: boolean = false;

  fichaTecnica!: FichaTecnica;
  tipoDeProduto!: TipoDeProduto;
  categoria!: Categoria;

  fichaTecnicas!: Observable<FichaTecnica[]>;
  tipoDeProdutos!: Observable<TipoDeProduto[]>;
  categorias!: Observable<Categoria[]>;

  idTipoDeProduto: number = 0;
  idCategoria: number = 0;
  nmFichaTecnica: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: FichaTecnicaService,
    private router: Router
  ) {}

  setOrder(value: string) {
    if (this.key === value) {
      this.reverse = !this.reverse;
    }

    this.key = value;
  }

  abrirModal(
    fichaTecnica: FichaTecnica,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean,
    imprimir: boolean
  ) {
    const modalRef = this.modalService.open(FichaTecnicaModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.fichaTecnica = fichaTecnica;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;
    modalRef.componentInstance.imprimir = imprimir;

    console.log(fichaTecnica);

    const resultadoForm: Promise<ResultadoProdutoForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoProdutoForm>) {
    resultadoForm
      .then((form) => {
        if (form.tipoCrud !== 'c') {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refresh();
        } else {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refresh();
        }
      })
      .catch(() => {
        console.log('Manter página');
      });
  }

  ngOnInit(): void {
    this.onRefresh();
  }

  refresh() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar fichas técnicas. Tente novamente mais tarde...'
    );
  }

  onRefresh() {
    this.fichaTecnicas = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );

    this.tipoDeProdutos = this.service.listarTipos().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );

    this.categorias = this.service.listarCategorias().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
  }

  filtrar() {
    // validar min. caracteres
    if (this.nmFichaTecnica.length > 0 && this.nmFichaTecnica.length < 3) {
      this.mensagemConfirmService.infoToaster(
        'Informe pelo menos (3) caracteres para nome da ficha técnica.'
      );
    } else {
      this.fichaTecnicas = this.service
        .filtrar(
          this.idTipoDeProduto,
          this.idCategoria,
          this.nmFichaTecnica,
          this.situacao
        )
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error$.next(true);
            this.handleError();
            return empty();
          })
        );
    }
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idTipoDeProduto = e.value;
  }

  onChangeCategoria(e: any) {
    console.log(e.value);
    this.idCategoria = e.value;
  }

  onChangeDs(e: any) {
    console.log(e.value);
    this.nmFichaTecnica = e.value;
  }

  onChangeSituacao(e: any) {
    console.log(e.value);
    this.situacao = e.value;
  }

  onExcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //salvar arquivo
    XLSX.writeFile(wb, this.fileName);
  }
}
