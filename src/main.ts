import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PegaModule } from './pega/pega.module';

platformBrowserDynamic()
  .bootstrapModule(PegaModule)
  .catch((err: any) => console.error(err));
