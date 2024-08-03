import { httpJwtInterceptor } from '@core/interceptors/http.jwt.interceptor';
import { httpErrorInterceptor } from '@core/interceptors/http.error.interceptor';
import { httpLoadingInterceptor } from '@core/interceptors/http.loading.interceptor';
import { httpLoggerInterceptor } from '@core/interceptors/http.logger.interceptor';

export const provideInterceptors = [
	//httpJwtInterceptor,
	httpLoadingInterceptor,
	httpLoggerInterceptor,
	httpErrorInterceptor
];
