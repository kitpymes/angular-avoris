import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormValidationProvider, AppFormValidator } from '@core/providers/validation';
import { HttpProvider } from '@core/providers/http';
import { TypedDialog } from '@shared/components/message';

import { HotelGetModel, HotelCreateModel } from '../hotel.model';
import { HotelService } from '../hotel.service';

@Component({
	templateUrl: './hotel-create.component.html',
	styleUrls: ['./hotel-create.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatCheckboxModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule],
	providers: [HttpProvider]
})
export class HotelCreateComponent extends TypedDialog<HotelCreateComponent, HotelGetModel> implements OnInit {
	onEventCreate = new EventEmitter<boolean>();

	model = {
		form: {
			isMaster: false,
			returnUrl: "",
			group: <UntypedFormGroup>{},
			errors: <any>{},
		}
	};

	private formBuilder = inject(UntypedFormBuilder);
	private formValidationProvider = inject(FormValidationProvider);
	private hotelService = inject(HotelService);

	ngOnInit() {
		this.model.form.group = this.formBuilder.group({
			name: ['', [AppFormValidator.requiredValidator,]],
			description: [],
			isDefault: [],
			isActive: [],
		});

		this.formValidationProvider.handleErrors(this.model.form);
	}

	onSubmit() {
		if (!this.model.form.group.dirty || this.model.form.group.invalid) {
			return;
		}

		const body: HotelCreateModel = { ...this.data, ...this.model.form.group.value };

		this.hotelService.create(body).subscribe({
			next: (success: boolean) => this.onEventCreate.emit(success),
			error: () => null,
			complete: () => null
		});
	}
}
