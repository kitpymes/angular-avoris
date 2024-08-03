import { Component } from '@angular/core';

import { HotelGridComponent } from '../hotel/grid/hotel-grid.component';

@Component({
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss'],
   standalone: true,
   imports: [HotelGridComponent]
})
export class HomeComponent {

}
