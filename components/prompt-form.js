import { useState } from "react";

const samplePrompts = [
	"a gentleman otter in a 19th century portrait",
	"bowl of ramen in the style of a comic book",
	"flower field drawn by Jean-Jacques Sempé",
	"illustration of a taxi cab in the style of r crumb",
	"multicolor hyperspace",
	"painting of fruit on a table in the style of Raimonds Staprans",
	"pencil sketch of robots playing poker",
	"photo of an astronaut riding a horse",
];
import sample from "lodash/sample";

export default function PromptForm(props) {
	const [prompt] = useState(sample(samplePrompts));
	const [image, setImage] = useState(null);

	return (
		<form
			onSubmit={props.onSubmit}
			className="py-5 animate-in fade-in duration-700"
		>
			<div className="flex text-center text-xl w-full justify-around">
				<select
					name="gender"
					defaultValue={"Female"}
					className="border py-1 px-4 rounded-md"
				>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
				<button
					className="bg-black text-white rounded-md text-small inline-block px-6 flex-none"
					type="submit"
				>
					Generate
				</button>
			</div>
		</form>
	);
}
