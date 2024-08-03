import { Injectable, NgZone, inject } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, Event, NavigationError } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { StackTraceUtil, dateFormat } from '@core/utils';
import { StorageStoreBehaviorSubject } from '@core/providers/storage';
import { ErrorModel, ErrorStore, ErrorType } from '@core/providers/error';
import { HttpProvider, AppHttpStatus, AppHttpRequestType, AppHttpOptions } from '@core/providers/http';
import { DialogProvider, SnackBarProvider } from '@shared/components/message';
import { IApiResult } from '@core/models';

const Settings = {
	url: {
		getAll: 'Error/getAll',
		getById: 'Error/getById',
		create: 'Error/create',
		update: 'Error/update',
		delete: 'Error/delete'
	},
	initState: <ErrorStore>{
		errors: <ErrorModel[]>[]
	}
};

@Injectable({ providedIn: "root" })
export class ErrorProvider extends StorageStoreBehaviorSubject<ErrorStore> {
	private readonly httpProvider = inject(HttpProvider);
	private readonly router = inject(Router);
	private readonly dialogProvider = inject(DialogProvider);
	private readonly zone: NgZone = inject(NgZone);
	private readonly snackBarProvider = inject(SnackBarProvider);
	private readonly location = inject(LocationStrategy);

	constructor() {
		super(Settings.initState);

		if (this.router) {
			this.router.events.subscribe((event: Event) => {
				if (event instanceof NavigationError) {
					this.showClientError(event.error);
				}
			});
		}
	}

	showServerError(result: IApiResult): Observable<any> {
		if (!environment.production && result.status !== AppHttpStatus.BadRequest) {
			console.error(ErrorType.Server, result);
		}

		const message = (result.message ?? result.data) || result.title;

		this.zone.run(() => setTimeout(() => this.snackBarProvider.error(message)));

		if (result.status === AppHttpStatus.Unauthorized) {
			setTimeout(() => this.router.navigate(['']), 600);
		}

		return of();
	};

	showCatchError(response: HttpErrorResponse): Observable<any> {
		const errorInfo = <ErrorModel>{
			AppName: environment.appName,
			ErrorId: `${Date.now()}-${dateFormat('yyyymmdd')}`,
			ErrorType: ErrorType.Server,
			ErrorName: response.name,
			ErrorDate: dateFormat('dd/mm/yyyy HH:mm:ss'),
			NavigatorInfo: this.getNavigatorInfo(),
			Url: response.url,
			AuthenticatedUser: '',//this.authService.Store(),
			StackTrace: response,
		};

		if (!environment.production) {
			console.error(ErrorType.Server, errorInfo);
		}

		this.zone.run(() => setTimeout(() => this.snackBarProvider.error('Ocurio un error inesperado. Vuelva a intentarlo en unas horas.')));

		return of();
	}

	showClientError(error: Error | TypeError): void {
		console.error({error});

		let translateKey!: string;

		if (!navigator?.onLine) {
			translateKey = 'APP.NOT_HAVE_INTERNET_CONNECTION';
		} else if (environment.production) {
			translateKey = 'APP.FRIENDLY_MESSAGE';
			this.post(this.getClientErrorInfo(error));
		}

		const message = translateKey;

		if (message) {
			inject(NgZone).runOutsideAngular(() => {
				setInterval(() => setTimeout(() => this.dialogProvider.error(message)));
			});

			return;
		}

		console.error(error.message, error.stack);
	}

	get = (): ErrorModel[] => this.Store().errors;

	private post = (body: ErrorModel): Observable<boolean>  => {
		const options: AppHttpOptions = {
			headers: new HttpHeaders(AppHttpRequestType.Json)
		};

		return this.httpProvider.post(Settings.url.create, body, options).pipe(
			map((isSaveError: any) => {
				if (isSaveError) {
					this.Store({ errors: [...this.Store().errors, body] });
				}

				return isSaveError;
			})
		);
	};

	private getClientErrorInfo = (error: Error | TypeError) => {
		return <ErrorModel>{
			AppName: environment.appName,
			ErrorType: ErrorType.Client,
			ErrorId: `${Date.now()}-${dateFormat('yyyymmdd')}`,
			ErrorName: error.name,
			ErrorDate: dateFormat('dd/mm/yyyy HH:mm:ss'),
			NavigatorInfo: this.getNavigatorInfo(),
			Url: (location instanceof PathLocationStrategy) ? location.path() : '',
			AuthenticatedUser: '', //this.authService.Store(),
			StackTrace: StackTraceUtil.parse(error as Error),
		};
	};

	private getNavigatorInfo = (): any => {
		return {
			language: navigator?.language,
			userAgent: navigator?.userAgent,
			connectionDownlink: (<any>navigator)['connection'].downlink,
			connectionEffectiveType: (<any>navigator)['connection'].effectiveType
		};
	};
}
