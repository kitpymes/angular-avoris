export type AgGridButtonModel = {
	onClick: (params: any) => {},
	content: {
		styles: {
			"display": string;
			"align-items": string;
			"justify-content": string;
		}
	},
	label?: {
		text?: string;
	},
	button: {
		styles: {
			"width.px": number;
			"height.px": number;
		}
	},
	matIcon: {
		type: string;
		styles: {
			"font-size.px": number;
			"display": string;
			"align-items": string;
			"justify-content": string;
		}
	}
};
