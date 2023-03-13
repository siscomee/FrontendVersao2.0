import { switchMap, delay, map, tap, first } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ResultadoCategoriaForm } from '../../../../shared/models/resultado-categoria-form';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { Categoria } from '../../../../shared/models/categoria';
import { FormValidator } from './../../../../shared/form-validator';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.css'],
})
export class CategoriaModalComponent implements OnInit {
  formModal!: FormGroup;

  @Input() title!: string;
  @Input() public categoria!: Categoria;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public toastService: ToastService,
    private service: CategoriaService
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      id: [],
      nmCategoria: [
        null,
        [Validators.required, Validators.maxLength(45)],
        [this.codigoExistente.bind(this)],
      ],
      inAtivo: ['1'],
      usuarioIdAtualiza: [1],
      dtUltAtualiza: [new Date().toISOString()],
    });
    if (this.categoria != undefined) {
      this.formModal.patchValue({
        id: this.categoria.id,
        nmCategoria: this.categoria.nmCategoria,
        inAtivo: this.categoria.inAtivo.toString(),
        usuarioIdAtualiza: this.categoria.usuarioIdAtualiza,
        dtUltAtualiza: this.categoria.dtUltAtualiza,
      });
    }
  }

  verificaCampo(campo: string) {
    return (
      this.formModal.get(campo)?.errors && this.formModal.get(campo)?.touched
    );
  }

  aplicaCssErro(campo: string) {
    return { 'is-invalid': this.verificaCampo(campo) };
  }

  converterInAtivo() {
    this.formModal.patchValue({
      inAtivo: Number(this.formModal.get('inAtivo')?.value),
    });
  }

  onSalvar() {
    this.converterInAtivo();

    if (this.formModal.valid) {
      this.service.save(this.formModal.value).subscribe((res: Categoria) => {
        let resultado!: ResultadoCategoriaForm;

        if (res.id == this.formModal.get('id')?.value) {
          resultado = { record: res, tipoCrud: 'u', status: true };
          this.editarCadastroTela(resultado);
          console.log('atualizado');
        } else {
          resultado = { record: res, tipoCrud: 'c', status: true };
          console.log('criado');
        }

        console.log(res);
        this.activeModal.close(resultado);
      });
    } else {
      FormValidator.verificaValidacoesForm(this.formModal);
      console.log('fomulário não está válido');
    }
  }

  editarCadastroTela(res: ResultadoCategoriaForm) {
    this.categoria.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.categoria.dtUltAtualiza = res.record.dtUltAtualiza;
    this.categoria.nmCategoria = res.record.nmCategoria;
    this.categoria.inAtivo = res.record.inAtivo;
  }

  onDeletar() {
    this.inativar();
    this.service.remove(this.formModal.value).subscribe((res: Categoria) => {
      let resultado: ResultadoCategoriaForm;
      if (res) {
        resultado = { record: res, tipoCrud: 'd', status: true };
      } else {
        this.formModal.patchValue({ inAtivo: 1 });
        this.categoria.inAtivo = this.formModal.get('inAtivo')?.value;
        resultado = { record: res, tipoCrud: '', status: true };
      }
      console.log(resultado);
      this.activeModal.close(resultado);
    });
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.categoria.inAtivo = this.formModal.get('inAtivo')?.value;
  }

  codigoExistente(control: FormControl) {
    return this.service
      .unicidade(control.value, this.formModal.get('id')?.value)
      .pipe(
        map((existe) => (existe ? { codigoExiste: true } : null)),
        tap(console.log),
        first()
      );
  }
}
