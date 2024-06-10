#! /bin/bash

REFRESH_INTERVAL=${REFRESH_INTERVAL:-3600}
COUNTER=0
RESET_COUNTER=$((REFRESH_INTERVAL*24))

nginx
echo Refresh interval: ${REFRESH_INTERVAL}s
echo Cache Refresh interval: ${RESET_COUNTER}s
echo Please enjoy a little Snake game while generating index.html

rm -rf /home/user/cache/hn
mkdir -p /home/user/cache/hn

while true
do
    echo "-------------------------------------------"
    echo "Regenerating index.html: $(date)"
    node --no-warnings ./bin/generate-html.mjs --hacker-news=hn --feed=newstories --target=index.html 2>&1
    node --no-warnings ./bin/generate-html.mjs --hacker-news=hn --feed=topstories --target=top.html 2>&1
    echo "Done: $(date)"

    COUNTER=$((COUNTER + REFRESH_INTERVAL))

    if [ $COUNTER -ge $RESET_COUNTER ] 
    then
        echo "Deleting cache!"
        rm -rf /home/user/cache/hn
        mkdir -p /home/user/cache/hn      
        COUNTER=0
    fi

    sleep $REFRESH_INTERVAL
done
