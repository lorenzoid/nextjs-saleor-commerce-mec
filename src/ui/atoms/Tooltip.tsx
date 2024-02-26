import { type ReactNode } from "react";

type TooltipProps = {
	children: ReactNode;
	text: string;
};

export function Tooltip(props: TooltipProps) {
	const { children, text } = props;

	return (
		<div className="group relative flex flex-col items-center">
			{children}
			<div className="tooltip-content absolute top-full w-auto whitespace-nowrap rounded-md bg-gray-400 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:flex group-hover:opacity-100">
				{text}
			</div>
		</div>
	);
}
