# [Paper HN](https://www.wolfgangfaust.com/project/paper-hn/)
Hacker News front page in the style of a print newspaper.

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Naereen/StrapDown.js.svg)](https://GitHub.com/Naereen/StrapDown.js/issues/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://shields.io/)

![](screenshot.png)

## How to run
```
yarn install
node ./bin/generate-html.mjs
```
This will create an `index.html` file which you can view. 

To automatically regenerate the output as you make changes:
```
yarn run watch
```

To update the list of stories on the front page:
```
rm cache/hn/*.json
```
