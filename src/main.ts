import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { PegaModule } from './pega/pega.module';

platformBrowser()
  .bootstrapModule(PegaModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch((err: any) => console.error(err));
