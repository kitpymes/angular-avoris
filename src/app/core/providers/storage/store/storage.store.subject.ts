import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import StoreBase from './store.base';

export class StorageStoreSubject<TStore extends object> extends StoreBase<TStore> {
   private observable$: Subject<TStore>;
   private cache!: TStore;

   constructor() {
      super();

      this.observable$ = new Subject<TStore>();
      this.Store$ = this.observable$.asObservable().pipe(distinctUntilChanged());
   }

   Store(nextState?: TStore): TStore {
      if (nextState) {
         this.cache = nextState;
         this.observable$.next(nextState);
      }

      return this.cache;
   }
}
