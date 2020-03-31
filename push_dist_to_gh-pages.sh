#!/bin/bash

echo -e "\nbuilding dist...\n" &&
npm run build &&
echo -e "\ntracking dist by removing it in gitingore\n"
sed -i -- 's/dist//g' ./.gitignore &&
git add . &&
echo -e "\ncommitting dist in order to push dist subtree for gh-pages...\n"
git commit -m "update dist subtree for gh-pages" &&
git push origin `git subtree split --prefix dist master`:gh-pages --force &&
echo -e "\nremoving dist commit, reseting to previous commit\n"
git reset --hard HEAD~1
echo -e "\nComplete!"