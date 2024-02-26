import { type ReactNode } from "react";

type TooltipProps = {
	children: ReactNode;
	text: string;
};

export function Tooltip(props: TooltipProps) {
	const { children, text } = props;

	return (
		<div className="group relative flex flex-col items-center ">
			{children}
			<div className="absolute top-full mt-2 hidden w-auto whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs  text-white group-hover:flex">
				{text}
			</div>
		</div>
	);
}
