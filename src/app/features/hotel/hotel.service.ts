import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResult } from '@core/models';
import { HttpProvider } from '@core/providers/http';
import { StorageStoreBehaviorSubject } from '@core/providers/storage';

import { HotelStore, HotelGetModel, HotelUpdateModel, HotelCreateModel, HotelDeleteModel } from './hotel.model';
import { mapToHotelGetModel } from './hotel.mapping';
import { HttpClient } from '@angular/common/http';

const Settings = {
	url: {
		get api() { return 'hotels' },
		get getAll() { return `${this.api}` },
		get getById() { return `${this.api}/getById` },
		get create() { return `${this.api}/create` },
		get update() { return `${this.api}/update` },
		get delete() { return `${this.api}/delete` },
	},
	get initState() {
		return <HotelStore>{
			items: <HotelGetModel[]>{},
		}
	}
};

@Injectable({ providedIn: "root" })
export class HotelService extends StorageStoreBehaviorSubject<HotelStore> {
	private readonly httpProvider = inject(HttpProvider);
  private readonly http = inject(HttpClient);


	constructor() {
		super(Settings.initState);
		this.refresh();
	}

	private getAll = (): Observable<any> => this.http.get(`http://localhost:3000/hotels`);

	refresh = (): void => {
		this.getAll().subscribe((result: any) => this.Store({ items: result }));
	};

	getById = (id: string): HotelGetModel | null => {
		const hotelStore = this.Store();
		const hotels = id && hotelStore.items;
		return hotels && hotels.find((hotel: HotelGetModel) => hotel.id === id) || null;
	};

	create = (body: HotelCreateModel): Observable<boolean> => {
		return body && this.httpProvider.post(Settings.url.create, body).pipe(
			map((result: ApiResult) => {
				if (result?.success) {
					const data: HotelGetModel = result.data;
					const store = this.Store();
					store.items.push(data);
				}

				return result?.success;
			})
		);
	};

	update = (body: HotelUpdateModel): Observable<boolean> => {
		return body && this.httpProvider.put(Settings.url.update, body).pipe(
			map((result: ApiResult) => {
				if (result?.success) {
					const store = this.Store();
					const hotel = store.items?.find((hotel: HotelGetModel)=> hotel.id === body.id);

					if (hotel) {
						mapToHotelGetModel(body, hotel);
					}
				}

				return result?.success;
			})
		);
	};

	delete = (body: HotelDeleteModel): Observable<boolean> => {
		return body && this.httpProvider.delete(Settings.url.delete, {body}).pipe(
			map((result: ApiResult) => {
				if (result?.success) {
					const store = this.Store();
					store.items.forEach(item => {
						if (body.ids.includes(item.id)) {
							item.deleted = true;
						}
					});
				}

				return result?.success;
			})
		);
	};
}
