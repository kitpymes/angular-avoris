import { Injectable, Injector, ElementRef, RendererFactory2, inject } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { assignObjectsDefined } from '@core/utils';
import { DynamicOverlay } from '@core/providers/overlay';
import { LoadingRef, LoadingConfig, LOADING_DATA_CONFIG } from '.';

@Injectable({ providedIn: "root" })
export class LoadingProvider {
	private dynamicOverlay = inject(DynamicOverlay);
	private overlay = inject(Overlay);

	//#region Spinner

	spin(elementRef?: ElementRef): LoadingRef<MatProgressSpinner> | null {
		return this.spinFromComponent(MatProgressSpinner, elementRef && {
			elementRef: elementRef
		});
	}

	spinFromComponent<TComponent>(component: ComponentType<TComponent>, loadingConfig?: LoadingConfig): LoadingRef<TComponent> | null {
		if (!component) {
			return null;
		}

		const currentOverlay = loadingConfig?.elementRef && this.dynamicOverlay.setContainerElement(loadingConfig.elementRef.nativeElement) || this.overlay;

		const loadingOverlayConfig = {
			target: {
				hasBackdrop: true,
				scrollStrategy: currentOverlay.scrollStrategies.block(),
				positionStrategy: currentOverlay.position().global().centerHorizontally().centerVertically(),
				backdropClickClose: false
			},
			source: loadingConfig?.overlayConfig
		};

		const config: LoadingConfig = {
			overlayConfig: assignObjectsDefined(loadingOverlayConfig.target, loadingOverlayConfig.source),
			loadingData: assignObjectsDefined({}, loadingConfig?.loadingData)
		}

		return this.show(component, currentOverlay, config);
	}

	//#endregion Spinner

	//#region Progress Bar

	bar(elementRef?: ElementRef): LoadingRef<MatProgressBar> | null {
		const loadingRef = this.barFromComponent(MatProgressBar, elementRef && {
			elementRef: elementRef
		});

		if (loadingRef) {
			const rendererFactory: RendererFactory2 = inject(RendererFactory2);
			const renderer = rendererFactory.createRenderer(null, null);
			renderer.setStyle(loadingRef.instance._elementRef.nativeElement, 'position', 'absolute');

			loadingRef.instance.color = 'primary';
			loadingRef.instance.mode = 'indeterminate';
		}

		return loadingRef;
	}

	barFromComponent<TComponent>(component: ComponentType<TComponent>, loadingConfig?: LoadingConfig): LoadingRef<TComponent> | null {
		if (!component) {
			return null;
		}

		const currentOverlay = loadingConfig?.elementRef && this.dynamicOverlay.setContainerElement(loadingConfig.elementRef.nativeElement) || inject(Overlay);
		const config: LoadingConfig = {
			overlayConfig: assignObjectsDefined({
				hasBackdrop: true,
				positionStrategy: currentOverlay.position().global().left().top(),
				backdropClickClose: false
			}, loadingConfig?.overlayConfig),
			loadingData: assignObjectsDefined({
				color: 'primary',
				mode: 'indeterminate'
			}, loadingConfig?.loadingData)
		}

		return this.show(component, currentOverlay, config);;
	}

	//#endregion Spinner

	private show<TComponent>(component: ComponentType<TComponent>, overlay: Overlay, loadingConfig?: LoadingConfig): LoadingRef<TComponent> {
		const overlayRef = this.dynamicOverlay.createOverlay(overlay, loadingConfig?.overlayConfig);

		const loadingRef = new LoadingRef<TComponent>(overlayRef);

		const injector = this.createInjector(loadingConfig?.loadingData);

		loadingRef.instance = this.dynamicOverlay.attachComponent(component, overlayRef, injector);

		if (loadingConfig?.overlayConfig?.backdropClickClose) {
			overlayRef.backdropClick().subscribe(() => overlayRef.detach() && loadingRef.close());
		}

		return loadingRef;
	}

	/*
  private injectComponent<TComponent>(loadingRef: LoadingRef<TComponent>, loadingData: any): PortalInjector {
	 const injectionTokens = new WeakMap();
	 injectionTokens.set(LoadingRef, loadingRef);
	 injectionTokens.set(LOADING_DATA_CONFIG, loadingData);
	 return new PortalInjector(this.injector, injectionTokens);
  }
	*/

	private createInjector<TComponent>(loadingData: any): Injector {
		const portalInjector = Injector.create({
			providers: [{ provide: LOADING_DATA_CONFIG, useValue: loadingData }],
		});

		return portalInjector;
	}
}
