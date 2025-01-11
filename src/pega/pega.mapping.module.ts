import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DYNAMIC_CONTAINERS,
  PContainerModule,
} from '@typescale/angular-adapter';
import { AddressLookupComponent } from './containers/AddressLookup.component';
import { AppShellComponent } from './containers/AppShell.component';
import { AttachmentComponent } from './containers/Attachment.component';
import { CaseViewComponent } from './containers/CaseView.component';
import { DefaultComponent } from './containers/Default.component';
import { DefaultFormComponent } from './containers/DefaultForm.component';
import { DetailsComponent } from './containers/Details.component';
import { DropdownComponent } from './containers/Dropdown.component';
import { FlowContainerComponent } from './containers/FlowContainer.component';
import { ModalViewContainerComponent } from './containers/ModalViewContainer.component';
import { OneColumnComponent } from './containers/OneColumn.component';
import { RadioButtonsComponent } from './containers/RadioButtons.component';
import { RichTextComponent } from './containers/RichText.component';
import { TextAreaComponent } from './containers/TextArea.component';
import { TextInputComponent } from './containers/TextInput.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, PContainerModule],
  declarations: [
    DropdownComponent,
    TextInputComponent,
    RadioButtonsComponent,
    OneColumnComponent,
    DefaultComponent,
    DefaultFormComponent,
    FlowContainerComponent,
    CaseViewComponent,
    ModalViewContainerComponent,
    AttachmentComponent,
    AppShellComponent,
    TextAreaComponent,
    RichTextComponent,
    DetailsComponent,
    AddressLookupComponent
  ],
  providers: [
    {
      provide: DYNAMIC_CONTAINERS,
      useValue: {
        default: DefaultComponent,
        Child: DefaultComponent,
        // layouts
        AppShell: AppShellComponent,
        CaseView: CaseViewComponent,
        Details: DetailsComponent,
        DefaultForm: DefaultFormComponent,
        FlowContainer: FlowContainerComponent,
        ModalViewContainer: ModalViewContainerComponent,
        OneColumn: OneColumnComponent,
        PreviewViewContainer: DefaultComponent,
        reference: DefaultComponent,
        Region: DefaultComponent,
        RootContainer: DefaultComponent,
        View: DefaultComponent,
        ViewContainer: DefaultComponent,
        // controls
        Attachment: AttachmentComponent,
        Checkbox: TextInputComponent,
        Currency: TextInputComponent,
        Date: TextInputComponent,
        DateTime: TextInputComponent,
        Decimal: TextInputComponent,
        Dropdown: DropdownComponent,
        Email: TextInputComponent,
        Integer: TextInputComponent,
        Percentage: TextInputComponent,
        Phone: TextInputComponent,
        RadioButtons: RadioButtonsComponent,
        RichText: RichTextComponent,
        TextArea: TextAreaComponent,
        TextInput: TextInputComponent,
        Time: TextInputComponent,
        // custom controls
        Labb_dx_ButtonGroup: RadioButtonsComponent,
        Labb_dx_Address: AddressLookupComponent
      },
      multi: true,
    },
  ],
})
export class PegaMappingModule { }
