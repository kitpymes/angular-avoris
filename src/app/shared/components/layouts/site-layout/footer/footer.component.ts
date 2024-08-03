import { CommonModule } from '@angular/common';
import { Component, VERSION } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

import { environment } from '@env/environment';

@Component({
   selector: 'app-site-layout-footer',
   templateUrl: './footer.component.html',
   styleUrls: ['./footer.component.scss'],
   standalone: true,
   imports: [CommonModule, MatToolbarModule]
})
export class SiteFooterComponent {
   angularVersion = VERSION.full;
   isProduction = environment.production;
   appName = environment.appName;
   environmentName = environment.appEnvironment;
   today: number = Date.now();
}
