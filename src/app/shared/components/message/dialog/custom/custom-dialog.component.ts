import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SafeHtmlPipe } from '@shared/pipes';
import { CustomDialogModel } from './custom-dialog.model';
import { TypedDialog } from '../dialog.directive';

@Component({
	selector: 'app-custom-dialog',
	templateUrl: './custom-dialog.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule, SafeHtmlPipe],
})
export class CustomDialogComponent extends TypedDialog<CustomDialogComponent, CustomDialogModel> {
	onClick = (confirm: boolean): void => this.dialogRef.close(confirm);
}
