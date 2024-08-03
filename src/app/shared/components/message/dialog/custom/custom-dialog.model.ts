export interface CustomDialogModel {
	title?: string,
	icon?: string,
	content: string,
	actions?: {
		confirmButtonText: string;
		cancelButtonText: string;
	}
}
