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


import { AppFormValidator, FormValidationProvider } from '@core/providers/validation';
import { HttpProvider } from '@core/providers/http';
import { TypedDialog } from '@shared/components/message';

import { HotelGetModel, HotelUpdateModel } from '../hotel.model';
import { HotelService } from '../hotel.service';

@Component({
	templateUrl: './hotel-edit.component.html',
	styleUrls: ['./hotel-edit.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatCheckboxModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule],
	providers: [HttpProvider]
})
export class HotelEditComponent extends TypedDialog<HotelEditComponent, HotelGetModel & {isMaster: boolean}> implements OnInit {
	onEventUpdate = new EventEmitter<boolean>();

	model = {
		isMaster: false,
		form: {
			returnUrl: "",
			group: <UntypedFormGroup>{},
			errors: <any>{},
		}
	};

	private formBuilder = inject(UntypedFormBuilder);
	private formValidationProvider = inject(FormValidationProvider);
	private permissionService = inject(HotelService);

	ngOnInit() {
		this.model.isMaster = this.data.isMaster;

		this.model.form.group = this.formBuilder.group({
			name: [{ value: this.data.name, disabled: !this.model.isMaster }, [AppFormValidator.requiredValidator]],
		});

		this.formValidationProvider.handleErrors(this.model.form);
	}

	onSubmit() {
		if (!this.model.form.group.dirty || this.model.form.group.invalid) {
			return;
		}

		const body: HotelUpdateModel = { ...this.data, ...this.model.form.group.value };

		this.permissionService.update(body).subscribe({
			next: (success: boolean) => this.onEventUpdate.emit(success),
			error: () => null,
			complete: () => null
		});
	}
}
