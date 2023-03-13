import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormValidator } from './../../../shared/form-validator';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { CategoriaService } from 'src/app/shared/services/categoria.service';
import { Categoria } from 'src/app/shared/models/categoria';

import { ResultadoCategoriaForm } from 'src/app/shared/models/resultado-categoria-form';
import { CategoriaModalComponent } from './categoria/categoria-modal.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  fileName = 'categoria.xlsx';
  public listaExcel: Boolean = false;
  title: string = 'Categoria';

  //paginação
  paginaAtual: number = 1;
  pageSize!: number;
  count = 0;
  totalElements!: number;

  //ordenação front
  key: string = 'InAtivo';
  reverse: boolean = false;

  //argumento abrirModal
  categoria!: Categoria;

  //busca e paginação
  categorias!: Observable<Categoria[]>;
  buscaResults!: Categoria[];
  error$ = new Subject<boolean>();
  queryField!: FormGroup;
  categoriasResult: any;

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: CategoriaService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.queryField = this.formBuilder.group({
      nmCategoria: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      inAtivo: ['-1'],
    });
    this.pegarLista();
  }

  //paginação
  pegarParams(page: number, inAtivo?: number, nmCategoria?: string): any {
    let params: any = {};

    if (page) {
      params['page'] = page - 1;
    }
    if (inAtivo !== undefined) {
      params['inAtivo'] = inAtivo;
    }
    if (nmCategoria) {
      params['nmCategoria'] = nmCategoria;
    }
    return params;
  }

  pegarLista() {
    const params = this.pegarParams(this.paginaAtual);

    this.service.list(params).subscribe(
      (response) => {
        this.categoriasResult = response?.categorias;
        this.pageSize = response?.paginaItens;
        this.count = response?.itensTotal;
      },
      (error) => {
        console.log(error);
        this.handleError();
      }
    );
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar cadastros de categorias. Tente novamente mais tarde.'
    );
  }

  handlePageChange(event: number): void {
    this.paginaAtual = event;
    console.log(event);
    if (this.buscaResults) {
      this.onBuscar(event);
    } else this.pegarLista();
  }

  setOrder(value: string) {
    if (this.key === value) {
      this.reverse = !this.reverse;
    }

    this.key = value;
  }

  //modal
  abrirModal(
    categoria: Categoria,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean
  ) {
    const modalRef = this.modalService.open(CategoriaModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.categoria = categoria;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;

    const resultadoForm: Promise<ResultadoCategoriaForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoCategoriaForm>) {
    resultadoForm
      .then((form) => {
        if (form.tipoCrud !== 'c') {
          this.mensagemConfirmService.abrirToast(resultadoForm);
        } else {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refreshPage();
        }
      })
      .catch(() => {
        console.log('Manter página');
      });
  }

  refreshPage() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }

  //busca
  verificaCampo(campo: string) {
    return this.queryField.get(campo)?.errors;
  }

  aplicaCssErro(campo: string) {
    return { 'is-invalid': this.verificaCampo(campo) };
  }

  onBuscar(page?: number) {
    if (this.queryField.valid) {
      let situacaoValue =
        Number(this.queryField.get('inAtivo')?.value) === -1
          ? undefined
          : Number(this.queryField.get('inAtivo')?.value);
      let nmCategoriaValue = this.queryField.get('nmCategoria')?.value;
      this.paginaAtual = page ? page : 1;
      const params = this.pegarParams(
        this.paginaAtual,
        situacaoValue,
        nmCategoriaValue
      );

      this.service.list(params).subscribe(
        (response) => {
          this.buscaResults = response.categorias;
          this.pageSize = response.paginaItens;
          this.count = response.itensTotal;
        },
        (error) => {
          console.log(error);
          this.handleError();
        }
      );
    } else {
      FormValidator.verificaValidacoesForm(this.queryField);
    }
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
