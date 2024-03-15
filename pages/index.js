import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import { XCircle as StartOverIcon } from "lucide-react";
import poseImage from "../public/pose-image.png";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
	const [predictions, setPredictions] = useState([]);
	const [error, setError] = useState(null);
	const [userUploadedImage, setUserUploadedImage] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const prevPrediction = predictions[predictions.length - 1];
		const prevPredictionOutput = prevPrediction?.output
			? prevPrediction.output[prevPrediction.output.length - 1]
			: null;
		console.log(e.target.gender.value);
		const body = {
			prompt: e.target.gender.value,
			init_image: userUploadedImage
				? await readAsDataURL(userUploadedImage)
				: // only use previous prediction as init image if there's a mask
				maskImage
				? prevPredictionOutput
				: null,
			poseImage,
		};

		const response = await fetch("/api/predictions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		const prediction = await response.json();

		if (response.status !== 201) {
			setError(prediction.detail);
			return;
		}
		setPredictions(predictions.concat([prediction]));

		while (
			prediction.status !== "succeeded" &&
			prediction.status !== "failed"
		) {
			await sleep(1000);
			const response = await fetch("/api/predictions/" + prediction.id);
			prediction = await response.json();
			if (response.status !== 200) {
				setError(prediction.detail);
				return;
			}
			setPredictions(predictions.concat([prediction]));

			if (prediction.status === "succeeded") {
				setUserUploadedImage(null);
			}
		}
	};

	const startOver = async (e) => {
		e.preventDefault();
		setPredictions([]);
		setError(null);
		setUserUploadedImage(null);
	};

	return (
		<div>
			<Head>
				<title>스모어톡의 AI 프로필 생성기</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>

			<main className="container text-center mx-auto p-5">
				{error && <div>{error}</div>}
				<h1 className="text-4xl font-medium">
					{predictions.length > 0 ? "Results" : "AI Profile"}
				</h1>
				{predictions.length == 0 && <p>Turn your image to profile</p>}
				<div className="flex flex-wrap">
					<div className="mt-5 border-hairline w-[450px] mx-auto relative">
						<Dropzone
							onImageDropped={setUserUploadedImage}
							predictions={predictions}
							userUploadedImage={userUploadedImage}
						/>
						<div
							className="bg-gray-50 relative h-[600px] w-full flex items-stretch"
							// style={{ height: 0, paddingBottom: "100%" }}
						>
							<Canvas
								predictions={[]}
								userUploadedImage={userUploadedImage}
								onDraw={() => {}}
							/>
						</div>
					</div>
					{predictions.length > 0 && (
						<div className="mt-5 border-hairline w-[450px] mx-auto relative">
							<div
								className="bg-gray-50 relative h-[600px] w-full flex items-stretch"
								// style={{ height: 0, paddingBottom: "100%" }}
							>
								<Canvas
									predictions={predictions}
									onDraw={() => {}}
								/>
							</div>
						</div>
					)}
				</div>
				<div className="max-w-[512px] mx-auto">
					<PromptForm onSubmit={handleSubmit} />

					<div className="text-center">
						{((predictions.length > 0 &&
							predictions[predictions.length - 1].output) ||
							userUploadedImage) && (
							<button className="lil-button" onClick={startOver}>
								<StartOverIcon className="icon" />
								New picture
							</button>
						)}

						<Download predictions={predictions} />
					</div>
					<div className="flex items-center">
						<Image
							src={"/smoretalk.svg"}
							alt="smoretalk"
							width={300}
							height={41}
						/>
						<Link
							href="https://smoretalk.oopy.io/"
							className=" flex-shrink-0"
						>
							<a
								className="lil-button whitespace-nowrap"
								target="_blank"
								rel="noopener noreferrer"
							>
								AI Profile is a demo site from <u>Smoretalk</u>
							</a>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}

function readAsDataURL(file) {
	return new Promise((resolve, reject) => {
		const fr = new FileReader();
		fr.onerror = reject;
		fr.onload = () => {
			resolve(fr.result);
		};
		fr.readAsDataURL(file);
	});
}
