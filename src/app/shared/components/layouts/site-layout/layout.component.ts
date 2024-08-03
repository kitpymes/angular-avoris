import { Component, OnInit, inject } from '@angular/core';

import { SiteHeaderComponent } from './header/header.component';
import { SiteBodyComponent } from './body/body.component';
import { SiteFooterComponent } from './footer/footer.component';

@Component({
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.scss'],
   standalone: true,
   imports: [SiteHeaderComponent, SiteBodyComponent, SiteFooterComponent],
})
export class SiteLayoutComponent implements OnInit {

   ngOnInit() {
   }

}
