"use client";

import { Star, StarHalf } from "lucide-react";

type RatingProps = {
	size: number;
	rating: number;
};

export const Rating = (props: RatingProps) => {
	const { rating, size } = props;

	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	return (
		<div className="star-rating end-0 flex">
			<div className="stars">
				{Array.from({ length: 5 }, (_, index) => (
					<Star size={size} fill="#111" key={index} strokeWidth={1} />
				))}
			</div>
			<div className="stars rating">
				<div className="flex justify-items-center text-yellow-400">
					{Array(fullStars)
						.fill(null)
						.map((_, index) => (
							<Star key={index} size={size} fill="#FDCC0D" strokeWidth={1} />
						))}
					{hasHalfStar && <StarHalf size={size} fill="#FDCC0D" strokeWidth={1} />}
				</div>
			</div>
		</div>
	);
};
