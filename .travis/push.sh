#!/bin/sh

cd _Output && git add --all && git commit --allow-empty -m 'Deployed' && git reset --soft HEAD~2 && git commit -m 'Deployed'

git remote add origin-pages https://mikemellor11:${token}@github.com/mikemellor11/mikemellor11.github.io.git > /dev/null 2>&1

git push --quiet --set-upstream origin-pages master -f