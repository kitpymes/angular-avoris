import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { environment } from '@env/environment';

@Component({
  selector: 'app-site-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule]
})
export class SiteHeaderComponent {
  model = {
    appName: environment.appName,
  };
}
