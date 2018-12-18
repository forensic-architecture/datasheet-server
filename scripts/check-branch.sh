#!/bin/bash

ENCRYPT_MESSAGE="\nThe .env.enc file has not changed its contents from the version on origin/develop.\nTo ensure that tests pass in Travis, you need to encrypt the contents of .env  before pushing to the remote, so that the Travis server can use your service account credentials.\nEnsure that the Travis CLI is installed on your local, run\n\n\tnpm run travis-encrypt\n\nand then push to the remote again.\nIf you don't care whether your build passes on Travis, you can run:\n\n\tgit push --no-verify\n\nand bypass this check.\n\n"

# check whether .env.enc has changed
if [ -z "`git diff origin/develop -- .env.enc`" ]; then
	echo $ENCRYPT_MESSAGE
	exit 1
fi


