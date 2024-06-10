import {hnget, getitem} from '../lib/hn.mjs'
import {init_titles, title_keyword} from '../lib/keywords.mjs'
import {page_info} from '../lib/page-extract.mjs'
import pug from 'pug'
import fs from 'fs-extra'
import psl from 'psl'
import html2text from 'html2plaintext'

function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1,arg.length).split('');
            flags.forEach(flag => {
            args[flag] = true;
            });
        }
    });
    return args;
}

;(async () => {

	const args = getArgs();
	console.log("Args: " + args);

	const stories = []
	const jobs = []
	const source_urls=['https://hacker-news.firebaseio.com/v0/']
	const story_urls=['https://news.ycombinator.com/item?id=']
	const story_domains=['news.ycombinator.com']
	const cache_path=args['hacker-news']
	const feed=args['feed']
	const target=args['target']

	for (var i=0; i<source_urls.length; i++){
		var source_url=source_urls[i]
		var story_url=story_urls[i]
		var story_domain=story_domains[i]

		await fs.ensureDir(`cache/${cache_path}/item`)
		await fs.ensureDir('cache/url')
		await init_titles(cache_path)
	}

	for (var i=0; i<source_urls.length; i++){
		var source_url=source_urls[i]
		var story_url=story_urls[i]
		var story_domain=story_domains[i]
		
		console.log("Cache path: " + cache_path);

		console.log("Retrieving new stories Ids: " + feed);

		var storyids=await hnget(source_url, feed,cache_path)

		for (var storyid of (storyids).slice(0, 30)) {
			try{
				console.log("Retrieving story details for " + storyid);
				var story = await getitem(source_url, storyid, cache_path)

				console.log("Parsing story");
				if (story.type !== 'story') continue // Filter out jobs

				console.log("Getting title keywords");
				story.keyword = title_keyword(story.title)
				if (story.text) { // Self post
					console.log("Converting self post");
					story.url = story_url+story.id
					story.domain = story_domain
					story.paragraph = html2text(story.text.split('<p>')[0])
					story.image = false
				} else {
					console.log("Retrieving external data from " + story.url);
					story.domain = psl.parse(new URL(story.url).hostname).domain

					console.log("Getting page info");
					const info = await page_info(story.url)
					story.paragraph = info.paragraph
					story.image = info.image
				}
				console.log("Story added!");
				stories.push(story)
			} catch (e) {
				console.log(`ERROR: Cannot parse story. Skipped!`)
			}

		}

		console.log("Retrieving Job stories Ids");

		const jobstories = await hnget(source_url, 'jobstories', cache_path)
		if(jobstories != null)
		{
			for (const jobid of jobstories.slice(0, 3)) {
				console.log("Retrieving job story details for " + jobid);
				const job = await getitem(source_url, jobid, cache_path)
				const split = job.title.split(' ')
				const splitix = (split.findIndex(w => w.toLowerCase() === 'hiring') || 3)+1
				job.title1 = split.slice(0, splitix).join(' ')
				job.title2 = split.slice(splitix).join(' ')
				jobs.push(job)
			}
		}
	}

	console.log("Generating $target");

	await fs.writeFile(target, pug.renderFile('index.pug', {
		stories,
		jobs,
		date: new Intl.DateTimeFormat('en', { dateStyle: "medium", timeStyle: "medium" }).format(new Date()),
	}))
})().then(null, err => {throw err})
