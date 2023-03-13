import { FormDebugComponent } from './form-debug/form-debug.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensagemFormComponent } from './mensagem-form/mensagem-form.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { ToastComponent } from './toast/toast.component';
import { DataBrPipe } from './pipes/databr.pipe';
import { CpfCnpjPipe } from './pipes/cpf-cnpj.pipe';
import { CepPipe } from './pipes/cep.pipe';
import { TelefonePipe } from './pipes/telefone.pipe';
import { CpfPipe } from './pipes/cpf.pipe';
import { CnpjPipe } from './pipes/cnpj.pipe';

@NgModule({
  declarations: [
    MensagemFormComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    FormFieldComponent,
    ToastComponent,
    DataBrPipe,
    CpfCnpjPipe,
    CepPipe,
    TelefonePipe,
    CpfPipe,
    CnpjPipe,
  ],
  imports: [CommonModule, NgbModule, FormsModule],
  exports: [
    MensagemFormComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    FormFieldComponent,
    ToastComponent,
    DataBrPipe,
    CpfCnpjPipe,
    CepPipe,
    TelefonePipe,
    CpfPipe,
    CnpjPipe,
  ],
})
export class SharedModule {}
