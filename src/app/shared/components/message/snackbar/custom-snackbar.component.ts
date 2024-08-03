import { Component, Inject, SecurityContext } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { SafeHtmlPipe } from '@shared/pipes';

@Component({
	templateUrl: './custom-snackbar.component.html',
	standalone: true,
	imports: [SafeHtmlPipe]
})
export class CustomSnackBarComponent {
    securityContextType = SecurityContext;

	constructor(
		matSnackBarRef: MatSnackBarRef<CustomSnackBarComponent>,
		@Inject(MAT_SNACK_BAR_DATA) public data: any
	) {
	}
}
