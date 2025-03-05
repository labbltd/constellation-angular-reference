import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PContainerModule } from '@labb/angular-adapter';

import { BrowserModule } from '@angular/platform-browser';
import { PegaComponent } from './pega.component';
import { PegaMappingModule } from './pega.mapping.module';

@NgModule({
  imports: [CommonModule, BrowserModule, PContainerModule, PegaMappingModule],
  declarations: [PegaComponent],
  exports: [PegaComponent],
  bootstrap: [PegaComponent]
})
export class PegaModule { }
