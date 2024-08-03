import { Component, OnInit, Inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { assignObjectsDefined } from '@core/utils';
import { LoadingRef, LOADING_DATA_CONFIG } from '@shared/components/loading';

@Component({
   selector: 'app-custom-loading-spin',
   templateUrl: './custom-loading-spin.component.html',
   styleUrls: ['./custom-loading-spin.component.scss'],
   standalone: true,
   imports: [CommonModule, MatProgressSpinner]
})
export class CustomLoadingSpinComponent implements OnInit {
   settings: any = {
      color: 'primary',
      mode: 'indeterminate',
      diameter: 180,
      strokeWidth: 15
   };

   constructor(
      private loadingRef: LoadingRef<CustomLoadingSpinComponent>,
      @Inject(LOADING_DATA_CONFIG) private loadingData: any
   ) { }

   ngOnInit() {
      this.settings = assignObjectsDefined(this.settings, this.loadingData);
   }
}
