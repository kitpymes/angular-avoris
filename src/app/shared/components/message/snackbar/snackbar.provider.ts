import { Injectable, TemplateRef, EmbeddedViewRef, inject } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar as DefaultSnackBar} from '@angular/material/snack-bar';

@Injectable({ providedIn: "root" })
export class SnackBarProvider {
	private snackbar = inject(MatSnackBar);

   success(message: string): MatSnackBarRef<DefaultSnackBar> {
      return this.show(message, "X", {
         duration: 7000,
         panelClass: 'message-snackbar-success',
         horizontalPosition: 'center',
         verticalPosition: 'bottom'
      });
   }

   error(message: string): MatSnackBarRef<DefaultSnackBar> {
      return this.show(message, "X", {
         duration: 9000,
         panelClass: 'message-snackbar-error',
         horizontalPosition: 'center',
         verticalPosition: 'bottom'
      });
   }

   info(message: string): MatSnackBarRef<DefaultSnackBar> {
      return this.show(message, "X", {
         duration: 7000,
         panelClass: 'message-snackbar-info',
         horizontalPosition: 'center',
         verticalPosition: 'bottom'
      });
   }

   show(message: string, labelButton?: string, config?: MatSnackBarConfig): MatSnackBarRef<DefaultSnackBar> {
      return this.snackbar.open(message, labelButton, config);
   }

   showFromComponent<T>(
      component: ComponentType<T>,
      config?: MatSnackBarConfig<any>): MatSnackBarRef<T> {
      return this.snackbar.openFromComponent<T>(component, config);
   }

   showFromTemplate(
      template: TemplateRef<any>,
      config?: MatSnackBarConfig): MatSnackBarRef<EmbeddedViewRef<any>> {
      return this.snackbar.openFromTemplate(template, config);
   }
}
