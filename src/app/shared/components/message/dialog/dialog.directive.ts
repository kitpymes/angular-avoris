import { Directive, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Directive()
export abstract class TypedDialog<TComponent, TData, TResult = any> {
	protected dialogRef: MatDialogRef<TComponent, TResult> = inject(MatDialogRef);
	protected data: TData = inject(MAT_DIALOG_DATA);
}
