#!/bin/bash
echo "Encrypting .env file for Travis..."

# confirm that user has access to forensic architecture datasheet
# if [ ! -z "$(travis repos | grep "forensic-architecture/datasheet-server")" ]
# 	echo "No travis encrypt possible, skipping this step."
# 	exit 0
# fi

# confirm travis is installed
if [ ! hash travis 2>/dev/null ]; then
	echo "============================================================================================"
	echo "ERROR: Travis CLI is not installed on your local. Please install from:"
	echo "\thttps://github.com/travis-ci/travis.rb"
	echo "After installing, make sure that you login with:"
	echo "\ttravis login --pro"
	echo "============================================================================================"
	exit 3
fi

# confirm there is a .env file to encrypt
if [ ! -f .env ]; then
	echo "============================================================================================"
	echo "ERROR: You must create a .env file and add your credentials. See .env.example for an example"
	echo "============================================================================================"
	exit 3
fi

# regex to match and delete 'before_install' and everything after it
# necessary to delete these lines to get Travis to build for multiple accounts
echo "creating new .travis.yml configuration"
sed -i.old '/^before_install.*/,$ d' .travis.yml
echo "old config file saved as .travis.yml.old"

travis encrypt-file .env --add --force --org
git add .env.enc
git add .travis.yml
echo ".env.enc created and added to commit"
