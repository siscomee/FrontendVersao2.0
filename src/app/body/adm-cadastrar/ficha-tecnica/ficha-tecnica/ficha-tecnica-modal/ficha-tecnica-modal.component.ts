import { switchMap, delay, map, tap, first, catchError } from 'rxjs/operators';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { empty, Observable, Subject } from 'rxjs';
import { MensagemConfirmService } from 'src/app/shared/services/mensagem-confirm.service';
import { Router } from '@angular/router';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';
import { Categoria } from 'src/app/shared/models/categoria';
import { ResultadoFichaTecnicaForm } from 'src/app/shared/models/resultado-ficha-tecnica-form';
import { FichaTecnica } from 'src/app/shared/models/ficha-tecnica';
import { FichaTecnicaService } from 'src/app/shared/services/ficha-tecnica.service';
import jsPDF from 'jspdf';
import { FormValidator } from 'src/app/shared/form-validator';

@Component({
  selector: 'app-ficha-tecnica-modal',
  templateUrl: './ficha-tecnica-modal.component.html',
  styleUrls: ['./ficha-tecnica-modal.component.css'],
})
export class FichaTecnicaModalComponent implements OnInit {
  @ViewChild('content', { static: false }) el!: ElementRef;
  formModal!: FormGroup;
  resultado!: ResultadoFichaTecnicaForm;
  tiposDeProdutos!: Observable<TipoDeProduto[]>;
  categorias!: Observable<Categoria[]>;
  fichaTecnicaUnicidade!: Observable<FichaTecnica[]>;

  idTipoDeProduto: number = 0;
  idCategoria: number = 0;
  nmProduto: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  @Input() title!: string;
  @Input() public fichaTecnica!: FichaTecnica;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;
  @Input() public imprimir!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private service: FichaTecnicaService,
    private mensagemConfirmService: MensagemConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      id: [null],
      usuarioIdAtualiza: [1],
      dtUltAtualiza: [new Date().toISOString()],
      tipoProdutoId: [null, [Validators.required]],
      categoriaId: [null, [Validators.required]],
      nmFichaTecnica: [null, [Validators.required, Validators.maxLength(200)]],
      tempoPreparo: [null, [Validators.required]],
      dtCriacao: [new Date().toISOString()],
      dtValidade: [
        new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      ],
      dsIngredientes: [null, [Validators.required, Validators.maxLength(200)]],
      qtdBruta: [null, [Validators.required]],
      txDesperdicio: [null, [Validators.required]],
      qtdLiquida: [null, [Validators.required]],
      dsModoPreparo: [null, [Validators.required, Validators.maxLength(500)]],
      dsObservacao: [null, [Validators.required]],
      inAtivo: ['1'],
    });
    if (this.fichaTecnica != undefined) {
      this.formModal.patchValue({
        id: this.fichaTecnica.id.toString(),
        tipoProdutoId: this.fichaTecnica.tipoProdutoId.toString(),
        categoriaId: this.fichaTecnica.categoriaId.toString(),
        nmFichaTecnica: this.fichaTecnica.nmFichaTecnica,
        tempoPreparo: this.fichaTecnica.tempoPreparo,
        dtCriacao: this.fichaTecnica.dtCriacao,
        dtValidade: this.fichaTecnica.dtValidade,
        dsIngredientes: this.fichaTecnica.dsIngredientes,
        qtdBruta: this.fichaTecnica.qtdBruta,
        txDesperdicio: this.fichaTecnica.txDesperdicio,
        qtdLiquida: this.fichaTecnica.qtdLiquida,
        dsModoPreparo: this.fichaTecnica.dsModoPreparo,
        dsObservacao: this.fichaTecnica.dsObservacao,
        inAtivo: this.fichaTecnica.inAtivo.toString(),
        usuarioIdAtualiza: this.fichaTecnica.usuarioIdAtualiza,
        dtUltAtualiza: this.fichaTecnica.dtUltAtualiza,
      });
    }

    this.tiposDeProdutos = this.service.listarTipos().pipe(
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

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  converterInAtivo() {
    this.formModal.patchValue({
      inAtivo: Number(this.formModal.get('inAtivo')?.value),
    });
    this.formModal.patchValue({
      tipoProdutoId: Number(this.formModal.get('tipoProdutoId')?.value),
    });
    this.formModal.patchValue({
      categoriaId: Number(this.formModal.get('categoriaId')?.value),
    });
  }

  async onSalvar() {
    this.converterInAtivo();

    if (this.formModal.valid) {
      if ((await this.validarUnicidade()) == false) {
        this.mensagemConfirmService.infoToaster('Informação já cadastrada.');
        return;
      }

      this.service.save(this.formModal.value).subscribe((res: FichaTecnica) => {
        let resultado: ResultadoFichaTecnicaForm = {
          record: res,
          tipoCrud: '',
          status: false,
        };
        if (res) {
          if (res.id == this.formModal.get('id')?.value) {
            resultado = { record: res, tipoCrud: 'u', status: true };

            let currentUrl = this.router.url;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([currentUrl]);
          } else {
            resultado = { record: res, tipoCrud: 'c', status: true };
          }
        }

        console.log(res);
        this.activeModal.close(resultado);
      });
    } else {
      FormValidator.verificaValidacoesForm(this.formModal);
      this.formModal.get('inAtivo')?.value === 1
        ? this.formModal.get('inAtivo')?.setValue('1')
        : this.formModal.get('inAtivo')?.setValue('0');
      console.log('fomulário não está válido');
    }
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar cadastros de fichas técnicas. Tente novamente mais tarde...'
    );
  }

  cadastrar(fichaTecnica: any) {
    fichaTecnica.date = new Date();
    this.resultado = {
      record: this.fichaTecnica,
      tipoCrud: 'c',
      status: true,
    };

    const crudResult = this.service.save(this.formModal.value);

    console.log(this.resultado);

    this.activeModal.close(this.resultado);
  }

  editarCadastroTela(res: ResultadoFichaTecnicaForm) {
    this.fichaTecnica.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.fichaTecnica.dtUltAtualiza = res.record.dtUltAtualiza;
    this.fichaTecnica.nmFichaTecnica = res.record.nmFichaTecnica;
    this.fichaTecnica.tempoPreparo = res.record.tempoPreparo;
    this.fichaTecnica.dtCriacao = res.record.dtCriacao;
    this.fichaTecnica.dtValidade = res.record.dtValidade;
    this.fichaTecnica.dsIngredientes = res.record.dsIngredientes;
    this.fichaTecnica.qtdBruta = res.record.qtdBruta;
    this.fichaTecnica.txDesperdicio = res.record.txDesperdicio;
    this.fichaTecnica.qtdLiquida = res.record.qtdLiquida;
    this.fichaTecnica.dsModoPreparo = res.record.dsModoPreparo;
    this.fichaTecnica.dsObservacao = res.record.dsObservacao;
    this.fichaTecnica.tipoProdutoId = res.record.tipoProdutoId;
    this.fichaTecnica.categoriaId = res.record.categoriaId;
    this.fichaTecnica.inAtivo = res.record.inAtivo;
    this.fichaTecnica.dsTipoProduto = res.record.dsTipoProduto;
  }

  cadastrando() {
    if (this.formModal.valid) {
      this.cadastrar(this.formModal.value);
    } else {
      this.verificaValidacoesForm(this.formModal);
      console.log('fomulário não está válido');
    }
  }

  OnDeletar() {
    this.inativar();

    this.service
      .inativar(this.formModal.get('id')?.value)
      .subscribe((res: any) => {
        let resultado: ResultadoFichaTecnicaForm;
        if (res) {
          resultado = { record: res, tipoCrud: 'd', status: true };
        } else {
          this.formModal.patchValue({ inAtivo: 1 });
          this.fichaTecnica.inAtivo = this.formModal.get('inAtivo')?.value;
          resultado = { record: res, tipoCrud: '', status: true };
        }
        console.log(resultado);
        this.activeModal.close(resultado);
      });
  }

  async validarUnicidade() {
    let unico = false;

    const response = await this.service
      .unicidade(
        this.formModal.get('tipoProdutoId')?.value,
        this.formModal.get('categoriaId')?.value,
        this.formModal.get('nmFichaTecnica')?.value,
        this.formModal.get('id')?.value
      )
      .toPromise();

    response == true ? (unico = true) : (unico = false);

    return unico;
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idTipoDeProduto = e.value;
  }

  cancelando() {
    this.resultado = {
      record: this.fichaTecnica,
      tipoCrud: '',
      status: true,
    };
    this.activeModal.close();
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.fichaTecnica.inAtivo = this.formModal.get('inAtivo')?.value;
  }

  verificaCampo(campo: string) {
    return (
      this.formModal.get(campo)?.errors && this.formModal.get(campo)?.touched
    );
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();
    console.log('foi...');
  }

  aplicaCssErro(campo: string) {
    const classeCss = 'is-invalid';

    return { 'is-invalid': this.verificaCampo(campo) };
  }

  imprimirPDF() {
    let pdf = new jsPDF('p', 'pt', 'a4', true);
    let str = 'COMEE';
    var pageHeight =
      pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
    var pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    pdf.setFont('arial', 'bold');
    pdf.setFontSize(14);
    pdf.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save('ficha_tecnica.pdf');
      },
    });
  }
}
