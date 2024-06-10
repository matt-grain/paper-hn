import fetch from 'node-fetch'
import fs from 'fs-extra'

export async function hnget(source, q, cache_path) {
	const cache = `cache/${cache_path}/${q}.json`
	if (await fs.exists(cache)) {
		return fs.readJson(cache)
	}
	const url = `${source}${q}.json`
	
	try {
		console.log("Retrieving: " + url);
		const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
		const ret = await res.json();
		await fs.writeJson(cache, ret);
		return ret;

	} catch (e) {
		if (e.name === "TimeoutError") {
			console.log(`ERROR: Timeout error for ${source}${q}.json`)
		} else {
			console.log(`ERROR: HTTP error while looking for ${source}${q}.json`)
		}
	}
}

export async function getitem(source,itemid, cache_path) {
	return await hnget(source,`item/${itemid}`, cache_path)
}
