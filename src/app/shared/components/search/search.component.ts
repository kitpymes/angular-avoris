import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';

import { SearchValueAccessor } from './search.value.accesor';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		NgIf,
		FormsModule,
		MatIconModule,
		MatInputModule,
		MatRippleModule,
	],
	animations: [
		trigger('slideInOut', [
			state('true', style({ width: '97%' })),
			state('false', style({ width: '97%' })),
			transition('true => false', animate('300ms ease-in')),
			transition('false => true', animate('300ms ease-out'))
		])
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchComponent),
			multi: true
		}
	]
})
export class SearchComponent extends SearchValueAccessor<string> {
	@ViewChild('searchInput', { static: true }) inputElement!: ElementRef<HTMLDivElement>

	@Output() onBlur = new EventEmitter<string>();
	@Output() onClose = new EventEmitter<void>();
	@Output() onEnter = new EventEmitter<string>();
	@Output() onFocus = new EventEmitter<string>();
	@Output() onOpen = new EventEmitter<void>();

	searchVisible = false;

	public close(): void {
		this.searchVisible = false;
		this.value = '';
		this.updateChanges();
		this.onClose.emit();
	}

	public open(): void {
		this.searchVisible = true;
		this.inputElement.nativeElement.focus();
		this.onOpen.emit();
	}

	onBlurring(searchValue: string) {
		if (!searchValue) {
			this.searchVisible = false;
		}
		this.onBlur.emit(searchValue);
	}

	onEnterring(searchValue: string) {
		this.searchVisible = true;
		this.onEnter.emit(searchValue);
	}

	onFocussing(searchValue: string) {
		this.searchVisible = true;
		this.onFocus.emit(searchValue);
	}
}
