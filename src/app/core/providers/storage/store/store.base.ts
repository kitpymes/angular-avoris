import { Observable } from 'rxjs';

export default abstract class StoreBase<TStore extends object> {
   protected storageKey!: string;
   protected abstract Store(nextState?: TStore): TStore;
   Store$!: Observable<TStore>;
}
