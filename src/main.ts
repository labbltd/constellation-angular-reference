import { platformBrowser } from '@angular/platform-browser';
import { PegaModule } from './pega/pega.module';

platformBrowser()
  .bootstrapModule(PegaModule)
  .catch((err: any) => console.error(err));
