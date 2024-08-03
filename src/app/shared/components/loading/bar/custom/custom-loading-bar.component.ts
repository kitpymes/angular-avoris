import { Component, OnInit, Inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { assignObjectsDefined } from '@core/utils';
import { LoadingRef, LOADING_DATA_CONFIG } from '@shared/components/loading';

@Component({
   selector: 'app-custom-loading-bar',
   templateUrl: './custom-loading-bar.component.html',
   styleUrls: ['./custom-loading-bar.component.scss'],
   standalone: true,
   imports: [MatProgressBarModule]
})
export class CustomLoadingBarComponent implements OnInit {
   settings: any = {
      color: 'primary',
      mode: 'indeterminate'
   };

   constructor(
      public loadingRef: LoadingRef<CustomLoadingBarComponent>,
      @Inject(LOADING_DATA_CONFIG) public loadingData: any
   ) { }

   ngOnInit() {
      this.settings = assignObjectsDefined(this.settings, this.loadingData);
   }
}
