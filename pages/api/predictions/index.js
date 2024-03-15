const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
	// remnove null and undefined values
	req.body = Object.entries(req.body).reduce(
		(a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
		{}
	);

	const body = JSON.stringify({
		// Pinned to a specific version of Stable Diffusion, fetched from:
		// https://replicate.com/stability-ai/stable-diffusion
		version: process.env.SDXL_VER,
		input: req.body,
	});
	console.log(body);

	const response = await fetch(`${API_HOST}/v1/predictions`, {
		method: "POST",
		headers: {
			Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
			"Content-Type": "application/json",
		},
		body,
	});

	if (response.status !== 201) {
		let error = await response.json();
		console.log(error);
		res.statusCode = 500;
		res.end(JSON.stringify({ detail: error.detail }));
		return;
	}

	const prediction = await response.json();
	res.statusCode = 201;
	res.end(JSON.stringify(prediction));
}
