import { InjectionToken, ElementRef } from '@angular/core';
import { OverlayConfig } from '@angular/cdk/overlay';

export type CustomLoadingSpinConfig = {
   color: 'primary' | 'accent' | 'warn' | undefined;
   mode?: 'determinate' | 'indeterminate';
   value?: number,
   diameter?: number;
   strokeWidth?: number;
};

export type CustomLoadingBarConfig = {
   color: 'primary' | 'accent' | 'warn' | undefined; //	ThemePalette of the theme. defaults to primary.
   mode: 'determinate' | 'indeterminate' | 'buffer' | 'query'; //	mode values are determinate,indeterminate,buffer, query. Default mode is determinate.
   value?: number; //	Indicates the progress bar value. Range is 0 to 100. Default value is 0
};
export const LOADING_DATA_CONFIG = new InjectionToken<any>('LOADING_DATA_CONFIG');

export interface LoadingConfig<TLoadingData = any> {
   elementRef?: ElementRef;
   loadingData?: TLoadingData;
   overlayConfig?: LoadingOverlayConfig;
}

export interface LoadingOverlayConfig extends OverlayConfig {
   backdropClickClose: boolean;
}
