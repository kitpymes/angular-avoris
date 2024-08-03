import { TypedDialog } from '@shared/components/message';
import { Injectable, TemplateRef, EmbeddedViewRef, inject, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DefaultDialogModel } from './default/default-dialog.model';
import { DefaultDialogComponent } from './default/default-dialog.component';
import { CustomDialogComponent } from './custom/custom-dialog.component';
import { CustomDialogModel } from './custom/custom-dialog.model';

@Injectable({ providedIn: "root" })
export class DialogProvider {
	private dialog = inject(MatDialog);

	info = (message: string, title = 'Info'): MatDialogRef<DefaultDialogComponent> => this.showFromComponent(DefaultDialogComponent, {
		data: <DefaultDialogModel>{ icon: 'info', title, content: message },
		panelClass: 'message-dialog-info',
		backdropClass: "message-dialog-backdrop",
		autoFocus: false
	});

	success = (message: string, title = 'Ok'): MatDialogRef<DefaultDialogComponent> => this.showFromComponent(DefaultDialogComponent, {
		data: <DefaultDialogModel>{ icon: 'done', title, content: message },
		panelClass: 'message-dialog-success',
		backdropClass: "message-dialog-backdrop",
		autoFocus: false
	});

	warning = (message: string, title = 'Warning'): MatDialogRef<DefaultDialogComponent> => this.showFromComponent(DefaultDialogComponent, {
		data: <CustomDialogModel>{ icon: 'warning', title, content: message },
		panelClass: 'message-dialog-warning',
		backdropClass: "message-dialog-backdrop",
		autoFocus: false
	});

	error = (message: string, title = 'Error'): MatDialogRef<DefaultDialogComponent> => this.showFromComponent(DefaultDialogComponent, {
		data: <CustomDialogModel>{ icon: 'error', title, content: message },
		panelClass: 'message-dialog-error',
		backdropClass: "message-dialog-backdrop",
		autoFocus: false
	});

	confirm = (html: string, {
		title = 'Warning',
		icon = 'warning',
		cancelButtonText = 'Cancelar',
		confirmButtonText = 'Eliminar'
	}: {
		title?: string,
		icon?: string,
		cancelButtonText?: string,
		confirmButtonText?: string,
	}): MatDialogRef<CustomDialogComponent> => this.custom({
		title,
		icon,
		content: html,
		actions: {
			cancelButtonText,
			confirmButtonText,
		}
	},
	{
			panelClass: 'message-dialog-warning',
			backdropClass: "message-dialog-backdrop",
			autoFocus: false,
			disableClose: false,
			widthPx: 500
	});

	custom = (data: CustomDialogModel, options?: {
		panelClass?: 'message-dialog-warning' | 'message-dialog-info' | 'message-dialog-success' | 'message-dialog-error',
		backdropClass?: string,
		autoFocus?: boolean,
		disableClose?: boolean,
		widthPx?: number,
	}): MatDialogRef<CustomDialogComponent> => this.showFromComponent(CustomDialogComponent, {
		data,
		panelClass: options?.panelClass ?? 'message-dialog-info',
		backdropClass: options?.backdropClass ?? "message-dialog-backdrop",
		autoFocus: options?.autoFocus ?? false,
		disableClose: options?.disableClose ?? false,
		width: options?.widthPx ? `${options?.widthPx}px` : '500px',
	});

	showFromComponent = <TComponent extends TypedDialog<TComponent, TData, TResult>, TData, TResult = any>(
		component: Type<TComponent>,
		config?: MatDialogConfig<TData>
	): MatDialogRef<TComponent, TResult> => this.dialog.open(component, config);

	showFromTemplate(
		template: TemplateRef<any>,
		config?: MatDialogConfig): MatDialogRef<EmbeddedViewRef<any>> {
		return this.dialog.open(template, config);
	}
}
