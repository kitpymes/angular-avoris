import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ColDef, GridReadyEvent, ColGroupDef, CellValueChangedEvent, CellClickedEvent, Module, SelectionChangedEvent, GetRowIdParams, RowValueChangedEvent, ICellRendererParams, IRowNode, INumberFilterParams } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ClipboardModule, ColumnsToolPanelModule, FiltersToolPanelModule, MasterDetailModule, MenuModule, MultiFilterModule, SetFilterModule } from 'ag-grid-enterprise';
import {
  GridApi,
  GridOptions,
  IDateFilterParams,
  IMultiFilterParams,
  ISetFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  SideBarDef,
  createGrid,
} from "@ag-grid-community/core";

import { dateString } from '@core/utils';
import { AgGridButtonComponent, AgGridButtonModel, AgGridProvider } from '@shared/components/aggrid';
import { SearchComponent } from '@shared/components/search';
import { DialogProvider, SnackBarProvider } from '@shared/components/message';

import { HotelGetModel, HotelCreateModel, HotelDeleteModel } from '../hotel.model';
import { HotelService } from '../hotel.service';

import { HotelCreateComponent } from '../../hotel/create/hotel-create.component';
import { HotelEditComponent } from '../../hotel/edit/hotel-edit.component';

@Component({
	selector: 'app-hotel-grid',
	templateUrl: './hotel-grid.component.html',
	styleUrls: ['./hotel-grid.component.scss'],
	standalone: true,
	imports: [AgGridAngular, FormsModule, AgGridModule, MatIconModule, MatChipsModule, MatToolbarModule, MatButtonModule, MatInputModule, MatButtonToggleModule, SearchComponent,]
})
export class HotelGridComponent implements OnInit, OnDestroy {
	private readonly permissionService = inject(HotelService);
	private readonly dialogProvider = inject(DialogProvider);
	private readonly aggridProvider = inject(AgGridProvider);
  private readonly snackBarProvider = inject(SnackBarProvider);

	model: any = {
		actions: {
			search: {
				visible: true,
				onSearch: (): void => this.aggridProvider.search(this.model),
			},
			onRefresh: (): void => {
				this.permissionService.refresh();
				this.model.gridOptions.api.refreshCells();
			},
			export: {
				visible: true,
				CSV: {
					enabled: true,
					onExport: (): void => this.aggridProvider.exportCsv(this.model),
				},
				WORD: {
					enabled: false,
					onExport: (): void => {},
				},
				PDF: {
					enabled: false,
					onExport: (): void => {},
				},
			},
			create: {
				visible: false,
				enabled: true,
				onClick: () => {
					const dialogRef = this.dialogProvider.showFromComponent(HotelCreateComponent, {
						disableClose: true,
						autoFocus: false,
						width: '500px',
						data: <HotelGetModel>{},
					});

					const componentInstance = dialogRef.componentInstance;

					const onSuccessSubscription = componentInstance.onEventCreate.subscribe((succesed: boolean) => {
						if (succesed) {
							componentInstance.model.form.group.reset();
							this.snackBarProvider.success("Los cambios se guardaron correctamente.");
							this.model.actions.onRefresh();
							dialogRef.close();
						}
					});

					dialogRef.afterClosed().subscribe(() => onSuccessSubscription?.unsubscribe());
				},
			},
			edit: {
				visible: false,
				enabled: false,
				onClick: (params: any) => {
					const dialogRef = this.dialogProvider.showFromComponent(HotelEditComponent, {
						disableClose: true,
						autoFocus: false,
						width: '500px',
						data: { ...params.rowData, ...{isMaster: this.model.isMaster}},
					});

					const componentInstance = dialogRef.componentInstance;

					const onSuccessSubscription = componentInstance.onEventUpdate.subscribe((succesed: boolean) => {
						if (succesed) {
							componentInstance.model.form.group.reset();
							this.snackBarProvider.success("Los cambios se guardaron correctamente.");
							this.model.gridSetRowSelectable();
							this.model.actions.onRefresh();
							dialogRef.close();
						}
					});

					dialogRef.afterClosed().subscribe(() => onSuccessSubscription?.unsubscribe());
				},
			},
			delete: {
				visible: false,
				enabled: true,
				onClick: () => {
					const dialogRef = this.dialogProvider.confirm("Desea eliminar ?", {
						title: 'Eliminar',
						cancelButtonText: 'Cerrar',
						confirmButtonText: 'Guardar',
					});

					dialogRef.afterClosed().subscribe((confirmed: boolean) => {
						if (confirmed) {
							const body = <HotelDeleteModel>{
								ids: this.model.actions.delete.selectedRows.map((item: HotelGetModel) => item.id),
							};

							this.permissionService.delete(body).subscribe({
								next: (succesed: boolean) => {
									if (succesed) {
										this.snackBarProvider.success("Los cambios se guardaron correctamente.");
										this.model.gridSetRowSelectable();
										this.model.actions.onRefresh();
									}
								},
								error: () => null,
								complete: () => null
							});
						}
					  });
				},
			},
		},
		gridModules: <Module[]>[
			ClientSideRowModelModule,
			CsvExportModule,
			ColumnsToolPanelModule,
			MasterDetailModule,
			MenuModule,
      ClipboardModule,
      FiltersToolPanelModule,
      MultiFilterModule,
      SetFilterModule,
		],
		gridLastUpdatedDate: <string>'',
		gridDataSubscription: <Subscription>{},
		gridSearchValue: '',
		gridSetRowSelectable: () => {
			this.model.gridOptions.api?.forEachNode((node: any) => {
				if (node.data.isDelete || this.model.actions.delete.selectedRows?.some((x: any) => x.permissionId === node.data.permissionId)) {
					node.setRowSelectable(false);
				} else {
					node.setRowSelectable(true);
				}
			});

			this.model.actions.delete.selectedRows = [];
		},
		gridOptions: {
			rowData: <HotelGetModel[] | null>[],
			sortingOrder: ['asc', 'desc'],
			suppressExcelExport: true,
			rowSelection: <"single" | "multiple">"multiple",
			suppressRowClickSelection: true,
			suppressMenuHide: true,
			defaultColDef: this.aggridProvider.defaultColDef(),
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
			columnDefs: <(ColDef | ColGroupDef)[]>[],
			onGridReady: (event: GridReadyEvent): void => {},
			isRowSelectable: (rowNode: IRowNode) => this.model.isMaster || (!rowNode.data.isStatic && (this.model.actions.delete?.visible && !rowNode.data?.isDelete)),
			getRowId: (params: GetRowIdParams) => params.data.permissionId,
			//getLocaleText: this.aggridProvider.getDefaultLocaleText,
			getRowStyle: this.aggridProvider.getDefaultRowStyle,
			getRowHeight: this.aggridProvider.getDefaultRowHeight,
			onSelectionChanged: (event: SelectionChangedEvent) => {
				console.log({ onSelectionChanged: event });

				this.model.actions.delete.selectedRows = this.model.gridOptions.api?.getSelectedRows();
				this.model.actions.delete.enabled = this.model.actions.delete.selectedRows.length > 0;
			},
			onCellClicked: (event: CellClickedEvent): void => {
				console.log({ onCellClicked: event });
			},
			onCellValueChanged: (event: CellValueChangedEvent): void => {
				console.log({ onCellValueChanged: event });
/*
				if (event.data && event.oldValue !== event.newValue) {
					const row = event.data;
					const body: HotelUpdateModel = cloneToHotelUpdateModel(row);
					this.model.onEdit(body);
				}
					*/
			},
			onRowValueChanged: (event: RowValueChangedEvent) => {
				console.log({ onRowValueChanged: event });
			},
		},
	};

	ngOnInit(): void {
		this.model.gridOptions.columnDefs = [
			{ field: 'id', hide: true },
			{
				headerName: 'name',
				field: 'name',
				sort: 'asc',
        filter: "agTextColumnFilter",
			},
			{
				headerName: 'image',
				field: 'image',
			},
			{
				headerName: 'address',
				field: 'address',
			},
			{
				headerName: 'stars',
				field: 'stars',
        maxWidth: 120,
        filter: 'agSetColumnFilter',
			},
			{
				headerName: 'rate',
				field: 'rate',
        maxWidth: 120,
        filter: "agNumberColumnFilter",
        filterParams: {
          numAlwaysVisibleConditions: 2,
          defaultJoinOperator: "AND",
        } as INumberFilterParams,
			},
      {
				headerName: 'price',
				field: 'price',
        maxWidth: 120,
        filter: "agNumberColumnFilter",
        filterParams: {
          numAlwaysVisibleConditions: 2,
          defaultJoinOperator: "AND",
        } as INumberFilterParams,
			},
			{
				field: "edit",
				headerName: "",
				pinned: 'right',
				maxWidth: 70,
				suppressMenu: true,
				cellRendererSelector: (params: ICellRendererParams<any>) => {
					if (this.model.actions.edit?.enabled) {
						return {
							component: AgGridButtonComponent,
							params: {
								options: <Partial<AgGridButtonModel>>{
									onClick: (params: any) => this.model.actions?.edit?.onClick(params),
									label: {
										text: '',
									},
									button: {
										styles: {
											"width.px": 35,
											"height.px": 35
										}
									},
									matIcon: {
										type: 'edit',
										styles: {
											"font-size.px": 20
										}
									}
								},
							},
						};
					}

					return undefined;
				},
			},
			{
				headerName: '',
				field: 'delete',
				pinned: 'right',
				maxWidth: 70,
				sortable: false,
				resizable: false,
				filter: false,
				headerCheckboxSelection: true,
				checkboxSelection: (params: any) => true, //!params.node.data.isStatic,
			},
		];

		this.model.gridOptions.onGridReady = (event: GridReadyEvent): void => {
			this.model.gridOptions.api = event.api;
			this.model.gridDataSubscription = this.permissionService.Store$.subscribe(store => {
				const data = store.items;
				if (data?.length > 0) {
					this.aggridProvider.addDynamicallyColumns(data[0], this.model, false);
					this.aggridProvider.setData(this.model, data);
					this.aggridProvider.setUpdateDate(this.model);
					this.aggridProvider.setColumnsVisible(this.model, [
						{ columnsName: ['edit'], isVisible: this.model.actions.edit?.visible },
						{ columnsName: ['delete'], isVisible: this.model.actions.delete?.visible }
					]);
					this.aggridProvider.resize(this.model);
				}
			});
		};
	}

	ngOnDestroy(): void {
		this.model.gridDataSubscription?.unsubscribe();
	}
}
