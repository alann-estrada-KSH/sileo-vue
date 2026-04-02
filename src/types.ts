import type { VNodeChild } from "vue";

export type SileoState =
	| "success"
	| "loading"
	| "error"
	| "warning"
	| "info"
	| "action";

export interface SileoStyles {
	title?: string;
	description?: string;
	badge?: string;
	button?: string;
	toast?: string;
}

export interface SileoButton {
	title: string;
	onClick?: () => void;
}

export const SILEO_POSITIONS = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
] as const;

export type SileoPosition = (typeof SILEO_POSITIONS)[number];

export interface SileoOptions {
	id?: string;
	title?: string;
	description?: VNodeChild | string;
	type?: SileoState;
	position?: SileoPosition;
	duration?: number | null;
	icon?: VNodeChild | null;
	styles?: SileoStyles;
	fill?: string;
	roundness?: number;
	button?: SileoButton;
	groupKey?: string;
}

export type SileoOffsetValue = number | string;
export type SileoOffsetConfig = Partial<
	Record<"top" | "right" | "bottom" | "left", SileoOffsetValue>
>;
