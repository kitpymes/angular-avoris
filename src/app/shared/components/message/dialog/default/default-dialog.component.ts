import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DefaultDialogModel } from './default-dialog.model';
import { TypedDialog } from '../dialog.directive';

@Component({
	selector: 'app-default-dialog',
	templateUrl: './default-dialog.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
})
export class DefaultDialogComponent extends TypedDialog<DefaultDialogComponent, DefaultDialogModel> {
}
