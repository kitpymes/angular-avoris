import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { StorageLocalProvider } from '../local/storage.local.provider';
import StoreBase from './store.base';

export class StorageStoreBehaviorSubject<TStore extends object> extends StoreBase<TStore> {
	private observable$: BehaviorSubject<TStore>;

	protected constructor(initState: TStore, storageKey?: string) {
		super();

		if (storageKey) {
			this.storageKey = storageKey;
			const localState = StorageLocalProvider.get<TStore>(this.storageKey);

			if (localState) {
				initState = localState;
			} else if (initState) {
				StorageLocalProvider.set<TStore>(this.storageKey, initState);
			}
		}

		this.observable$ = new BehaviorSubject<TStore>(initState);
		this.Store$ = this.observable$.asObservable().pipe(distinctUntilChanged());
	}

	Store = (nextState?: TStore): TStore => {
		if (nextState) {
			if (this.storageKey) {
				StorageLocalProvider.set<TStore>(this.storageKey, nextState);
			}

			this.observable$.next(nextState);
		}

		return this.observable$.getValue();
	};
}
