import { Injectable } from '@angular/core';
import { ColDef, ColGroupDef, GetQuickFilterTextParams, RowHeightParams, RowStyle, ValueGetterParams } from 'ag-grid-community';

import { dateString } from '@core/utils';


@Injectable({ providedIn: "root" })
export class AgGridProvider {
	getDefaultRowStyle = (params: any): RowStyle | undefined => {
		return {
			background: params.node.rowIndex % 2 === 0 ? '#e1e4ea' : '',
		};
	};

	getDefaultRowHeight = (params: RowHeightParams<any>) =>
		params.node.parent?.parent?.group ? 200 : 50;

	addDynamicallyColumns = (row: any, model: any, enabled = true) => {
		if (enabled && row) {
			let colDefs: (ColDef | ColGroupDef)[] = model.gridOptions.api?.getColumnDefs();
			colDefs.length = 0;

			const keys = Object.keys(row);

			keys.forEach(key => colDefs.push(<ColDef | ColGroupDef>{
				field: key,
				valueGetter: (params: ValueGetterParams) => {
					const value = params.data[key];

					if (Array.isArray(value)) {
						return JSON.stringify(value[0], null, " ");
					}

					return value;
				},
				rowGroup: false,
				hide: false,
				filter: false,
				sortable: false,
			}));

			model.gridOptions.api?.setGridOption('columnDefs', colDefs);
		}
	};

	resize = (model: any) => window.addEventListener("resize", () =>
		setTimeout(() => model.gridOptions.api?.sizeColumnsToFit(), 1000))

	setData = (model: any, data: any) => model.gridOptions.api?.setGridOption('rowData', data);

	setUpdateDate = (model: any) => model.gridLastUpdatedDate = dateString().replace(/,/g, " -");

	setColumnsVisible = (model: any, cols: { columnsName:string[], isVisible: boolean }[]) =>{
		cols.forEach((item: { columnsName:string[], isVisible: boolean }) => {
			model.gridOptions.api?.setColumnsVisible(item.columnsName, item.isVisible);
		});
	};

	search = (model: any) =>
		model.gridOptions.api?.setGridOption('quickFilterText', model.gridSearchValue) && this.resize(model);

	exportCsv = (model: any) => model.gridOptions.api?.exportDataAsCsv();

	defaultColDef = () => <ColDef>{
		flex: 1,
		minWidth: 100,
		sortable: true,
		filter: "agTextColumnFilter",
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
		resizable: true,
		editable: false,
		enableCellChangeFlash: true,
		cellStyle: {
			display: 'flex',
			'align-items': 'center',
		},
		getQuickFilterText: (params: GetQuickFilterTextParams): string => params.colDef.hide ? '' : params.value,
	};
}
