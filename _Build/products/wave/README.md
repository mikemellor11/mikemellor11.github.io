# README #

## Git Fork Offering Setup

- Only make modifications to base code on the base repo, titled the name of the repo e.g Ripple, Wave ect. and then pull the changes from the upstream on your fork
- Making base code modifications on a fork is fine but make sure you always do a pull request and pull **JUST CHANGES THAT ARE GLOBAL TO ALL PROJECTS** back up to the base repo, this usually means separating out content and code changes at the time of creating your pull requests as to avoid getting unneeded clutter in the base project
- Any new code/features you make ensure that they are toggle-able with the default being off, this way other projects don't automatically get features they don't want (this shouldn't happen anyway with proper tagging but it's useful to be able to turn features on/off anyway)

#### Dependancies ####

*We currently don't have a minimum or maximum version, we've very evergreen, but please flag if after installing the below softwares you still have problems.*

* Node
* NPM
* grunt-cli
* Bower
* Git
* wget
* imagemagick (Wave, Stream)
* safari webdriver (Stream)
* java command line (Stream)

If on a mac, this is the suggested route.

* Install brew - [http://brew.sh/]() - then use to install
	* brew install wget
	* brew install git
	* brew install imagemagick
	* brew install cask
		* brew cask install java
* Install NVM - [https://github.com/creationix/nvm]() - then use to install
	* nvm install node
	* npm install npm -g (updates npm to latest)
	* npm install bower -g
	* npm install grunt-cli -g
* Install safari webdriver - [http://selenium-release.storage.googleapis.com/index.html?path=2.48/]() - download SafariDriver.safariextz, click it and click trust

Congratulations, you now have everything you need, windows you're on your own, god help you.	

#### Working on source code ####

* In reality you will most likely need to make the changes on a branded branch as that will have content/slides/videos for you to use in the debugging (the base repos don't have any content in them to avoid passing content up the forks). Once you've made you're changes on a branded fork you'll need to do a pull request on just the changes you've made. So make you're changes, commit them and push them to the branded repo, then run these commands.

~~~~
	git checkout -b mybranch
	git fetch upstream
	git reset --hard upstream/master
	git cherry-pick <commit-hash>
	git push origin mybranch:mybranch
~~~~

* Then you'll need to go into bitbucket and create a pull request for the branch you just pushed and merge it back into the parent base repo.
* Once you've merged the pull request you can delete both the remote branch and the local one you just created (mybranch). Then you need to pull the pull request back into the forked instances (this results in duplicate commits which can be removed by rebasing but we'll keep it simple for now).
* The following code is useful for syncing a repo and getting it up to date, add this to your .gitconfig

~~~~
	[alias]
		sync = "!f() { \
			export GIT_MERGE_AUTOEDIT=no && \
			git checkout development && \
			git pull upstream master && \
			git push origin development && \
			git checkout master && \
			git merge development && \
			git push origin master && \
			git checkout development; \
		}; f"
~~~~

#### Creating a new instance ####

* To create a new instance simply go to the base repo and click fork
* Clone the repo to your computer
* Create you're development branch
* Add the correct upstream remote for the repo you've forked from, this allows you to pull changes from the base repo or run the sync alias, e.g.

~~~~
	git remote add upstream https://mmellor@bitbucket.org/fishawackdigital/wave.git
~~~~

* Grab the content.json from _Build/example/content.json and paste it directly into the _Build/ folder
* Add your content to the _Build/content.json and turn features on/off
* Add assets to _Build/media
* Change the colors / variables in _Build/sass/_variables.scss

### Who do I talk to? ###

* Repo owner/admin - mike.mellor@f-grp.com
* If you need more information contact mike.mellor@f-grp.com or digital@f-grp.com