import Spinner from "components/spinner";

export default function Loading() {
	return (
		<div className="absolute text-white top-0 left-0 z-[100] w-[100vw] h-[100dvh] bg-black opacity-50 flex items-center justify-center">
			<Spinner />
		</div>
	);
}
