/**
 *
 * Use:
 *
   @AutoUnsubscribe() or @AutoUnsubscribe(['notSub'])
   @Component({
      selector: 'app-theme',
      templateUrl: './theme.component.html',
      styleUrls: ['./theme.component.scss'],
      encapsulation: ViewEncapsulation.None
   })
   export class ThemeComponent implements OnInit {
      private sub: Subscription;
      private notSub: Subscription;

      ngOnInit() {
         this.sub = this.themeProvider.Store$.subscribe(store => {
           ...
         });

         this.notSub = this.pepeProvider.Store$.subscribe(store => {
            ...
         });
      }
   }
 *
 * @param blackList Subscripciones que no quieres desubscribir
 */
export function AutoUnsubscribe(blackList?: string[]) {
   return function (constructor: any) {
      const originalngOnDestroy = constructor.prototype.ngOnDestroy;

      constructor.prototype.ngOnDestroy = function () {
         for (let prop in this) {
            const property = this[prop];

            if ((!blackList || !blackList.includes(prop)) && typeof property.unsubscribe === "function") {
               property.unsubscribe();
            }
         }

         originalngOnDestroy && typeof originalngOnDestroy === 'function' && originalngOnDestroy.apply(this, arguments);
      };
   }
}
