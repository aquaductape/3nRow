#!/bin/bash
# https://gist.github.com/cobyism/4730490#gistcomment-1374989 current
# https://gist.github.com/cobyism/4730490#gistcomment-1394421 better but you don't have set up that way currently

branch="gh-pages"
output="dist"

function subtree_push() {
    git subtree push --prefix $output origin $branch
}

function subtree_split() {
    git push origin $(git subtree split --prefix $output master):gh-pages --force
}

function is_in_remote() {
    local git_command="git ls-remote --heads origin ${branch}"
    local existed_in_remote=$($git_command)

    if [[ ${existed_in_remote} ]]; then
        echo "remote branch $branch exists"
        echo $git_command
        echo -e "$existed_in_remote\n"
        echo -e "update $branch against a rebased master branch"
        subtree_split

    else
        echo -e "there's no remote branch $branch"
        subtree_push
    fi
}

echo -e "\nbuilding $output...\n" &&
    npm run build &&
    echo -e "\ntracking $output by removing it in gitingore\n"
sed -i -- 's/dist//g' ./.gitignore &&
    git add . &&
    echo -e "\ncommitting $output in order to push dist subtree for $branch...\n"
git commit -m "update $output subtree for $branch" &&
    is_in_remote

echo -e "\nremoving $output commit, reseting to previous commit\n"
git reset --hard HEAD~1
echo -e "\nComplete!"
