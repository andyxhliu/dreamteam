#Group Git Cheat Sheet

##Rule numero uno
- **Never code on master** until you're ready to deploy! Always check to see that you are on the development branch before you open up and edit any files.


##Setting up your git branch for the first time
`git clone git@github.com:username/repo-name-here.git` - Clone a GitHub repo into your a directory on your computer.

`gco -b development` - Makes a new branch called development when you are first ready to go and puts you into it.

##Creating a new branch to work on a feature
`git branch feature-branch` - Creates a branch new feature branch so that you aren't working on development.

`git checkout feature-branch` or `gco feature-branch` - Change into a different branch that has already been made.

*OR*

`gco -b feature-branch` - This would create & copy everything into a new feature branch in one command.

##Merging your teams work before pushing
`git pull origin development` - Run this command from your development branch when your team mates have pushed up new changes to implement.

`git merge development` - Next go to your current feature branch and merge from development to test the changes first. Fix the bugs!

`gco development` + `git merge feature-branch` to finally merge your feature branch changes once it's bug free. Time to push to github!

`git push origin development` - Remember it's **DEVELOPMENT**!

##Extra commands
`git branch` - Shows you every branch that currently exists in your directory and where you currently are.

`git status` or `gst` - Checks the git status to have a look at any changes that have been made on your work.