import { OverlayRef } from '@angular/cdk/overlay';

export class LoadingRef<T = any> {
   instance!: T;

   constructor(private overlayRef: OverlayRef) { }

   close(): void {
      this.overlayRef.dispose();
   }
}
