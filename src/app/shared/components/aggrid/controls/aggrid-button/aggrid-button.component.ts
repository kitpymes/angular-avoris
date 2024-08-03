import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { assignObjectsDefined } from '@core/utils';

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { CommonModule } from "@angular/common";
import { AgGridButtonModel } from "./aggrid-button.model";

@Component({
	standalone: true,
	imports: [MatButtonModule, MatIconModule, CommonModule],
	template: `
	<div [ngStyle]="model.content.styles">
		<button mat-mini-fab (click)="onClick($event)" [ngStyle]="model.button.styles">
			@if(model.label?.text) {
				{{model.label?.text}}
			}

			@if(model.matIcon.type) {
				<mat-icon [ngStyle]="model.matIcon.styles">{{model.matIcon.type}}</mat-icon>
			}
		</button>
	</div>
	`,
})
export class AgGridButtonComponent implements ICellRendererAngularComp {
	params: any;

	model = <AgGridButtonModel>{
		content: {
			styles: {
				"display": "flex",
				"align-items": "center",
				"justify-content": "space-between",
			}
		},
		button: {
			styles: {
				"width.px": 20,
				"height.px": 20,
			}
		},
		matIcon: {
			styles: {
				"display": "flex",
				"align-items": "center",
				"justify-content": "center",
			}
		}
	};

	agInit(params: any): void {
		this.params = params;

		const options: AgGridButtonModel = params.options;

		if (options?.button?.styles) {
			this.model.button.styles = assignObjectsDefined(this.model.button.styles, options.button.styles);
		}

		if (options?.content?.styles) {
			this.model.content.styles = assignObjectsDefined(this.model.content.styles, options.content.styles);
		}

		if (options?.matIcon) {
			if (options.matIcon.type) {
				this.model.matIcon.type = options.matIcon.type;
			}

			if (options.matIcon.styles) {
				this.model.matIcon.styles = assignObjectsDefined(this.model.matIcon.styles, options.matIcon.styles);
			}
		}
	}

	refresh(params?: any): boolean {
		return true;
	}

	onClick($event: any) {
		if (this.params.options.onClick instanceof Function) {
			const params = {
				event: $event,
				rowData: this.params.node.data
			};

			this.params.options.onClick(params);
		}
	}
}
