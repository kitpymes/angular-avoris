import { ComponentFactoryResolver, Inject, Injector, NgZone, Renderer2, RendererFactory2, ComponentRef, Injectable } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';

import {
   Overlay,
   OverlayKeyboardDispatcher,
   OverlayPositionBuilder,
   ScrollStrategyOptions,
   OverlayConfig,
   ComponentType,
   OverlayRef,
   OverlayOutsideClickDispatcher } from '@angular/cdk/overlay';

import { Directionality } from '@angular/cdk/bidi';
import { ComponentPortal } from '@angular/cdk/portal';

import { DynamicOverlayContainer } from './dynamic-overlay-container';

@Injectable({ providedIn: "root" })
export class DynamicOverlay extends Overlay {
   private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
   private renderer: Renderer2;

   constructor(
      scrollStrategies: ScrollStrategyOptions,
      _overlayContainer: DynamicOverlayContainer,
      _componentFactoryResolver: ComponentFactoryResolver,
      _positionBuilder: OverlayPositionBuilder,
      _keyboardDispatcher: OverlayKeyboardDispatcher,
      _injector: Injector,
      _ngZone: NgZone,
      @Inject(DOCUMENT) _document: any,
      _directionality: Directionality,
      _location: Location,
      _outsideClickDispatcher: OverlayOutsideClickDispatcher,
      rendererFactory: RendererFactory2) {

      super(
         scrollStrategies,
         _overlayContainer,
         _componentFactoryResolver,
         _positionBuilder,
         _keyboardDispatcher,
         _injector,
         _ngZone,
         _document,
         _directionality,
         _location,
         _outsideClickDispatcher)

      this.renderer = rendererFactory.createRenderer(null, null);
      this._dynamicOverlayContainer = _overlayContainer;
   }

   public setContainerElement(containerElement: HTMLElement): DynamicOverlay {
      this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
      this._dynamicOverlayContainer.setContainerElement(containerElement);
      return this;
   }

   public createOverlay = (overlay: Overlay, overlayConfig?: OverlayConfig): OverlayRef => overlay.create(overlayConfig);

   public attachComponent<TComponent>(component: ComponentType<TComponent>, overlayRef: OverlayRef, injector: Injector): TComponent {
      const containerPortal = new ComponentPortal(component, null, injector);
      const containerRef: ComponentRef<TComponent> = overlayRef.attach(containerPortal);
      return containerRef.instance;
   }
}
