#!/bin/bash
echo "Encrypting .env file for Travis..."
if hash travis 2>/dev/null; then
	if [ ! -f .env ]; then
		echo "============================================================================================"
		echo "ERROR: You must create a .env file and add your credentials. See .env.example for an example"
		echo "============================================================================================"
		exit 3
	else
		travis encrypt-file .env --add --force --pro
		git add .env.enc
		git add .travis.yml
		echo ".env.enc created and added to commit"
	fi
else
	echo "============================================================================================"
	echo "ERROR: Travis CLI is not installed on your local. Please install from:"
	echo "\thttps://github.com/travis-ci/travis.rb"
	echo "After installing, make sure that you login with:"
	echo "\ttravis login --pro"
	echo "============================================================================================"
	exit 3
fi
