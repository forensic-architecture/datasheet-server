# Contributing to Datasheet-Server

First and foremost, thank you so much. We really appreciate you take the time to try and contribute and make Datasheet-Server better for those who use it.

#### Contributing means many things

Contributing can indeed be about contributing code or creating an issue, but can also take many other forms, and this document is an attempt to describing what are all the possible ways in which you can contribute.

- Updating or correcting documentation
- Fixing an open issue
- Requesting a feature
- Reporting a bug

If you're new to this project, you could check the issues that are tagged ["good first issue"](https://github.com/forensic-architecture/Datasheet-Server/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22). These are generally those that are considered easy ways in.

#### Showing support for Datasheet-Server

Please keep in mind that open source software is built by people like you, who spend their free time creating things the rest the community can use.

There are other ways in which you can contribute to the communal success of this project, such as starring the [project](https://github.com/forensic-architecture/Datasheet-Server) on Github.

## Getting Started

- Make sure you have a [GitHub account](https://github.com/signup/free)
- Fork the repository on GitHub

## Issues

WIP

### Before creating an issue

Try to follow these guidelines:

- **Investigate the issue**: WIP
- **See if a ticket already exists**: WIP
- **Ask the community**: WIP
- **Proceed in creating your issue**: WIP

### Creating an issue

WIP

## Pull Requests

### Before making changes

1. If you are a contributor, you will need to create a fork of this repository
   on your own GitHub handle, as you will not have commit access to the
   forensic architecture repo.
2. Create a new branch from _develop_ (not master or staging). The branch
   should be prefixed with 'topic/' if you are intending to submit a feature
   ('enhancement' tag in the issue), or with 'fix/' if you are fixing a bug
   ('bug' tag in the issue).

All of your commits go in this branch. When the feature/fix is complete, follow
the instructions below to submit a PR for the branch.

### Submitting changes as Pull Requests

In order to submit a branch as a PR, you'll need to install the [Travis CLI](https://github.com/travis-ci/travis.rb). The documentation for this is a little shifty: if you're developing on a Mac, you can easily install it with `brew install travis`. The Travis CLI is necessary so that you can encrypt your service account credentials and use them while testing in Travis CI.

To do this, you need to run one extra command before you push commits
to a remote branch:
```
npm run travis-encrypt
```
This command encrypts your private key and service account email in .env in
such a way that they can still be used while running tests on Travis' server.
This command will add a commit to your branch that modifies the binary file
.env.enc, and updates your Travis config accordingly. After running this
command, you should be able to pass the pre-push check and run tests in the
Travis server.

## Additional resources

More information will be available on the [git workflow wiki page](https://github.com/forensic-architecture/Datasheet-Server/wiki).

You can also refer to Github's guide to [forking a repository](https://help.github.com/articles/fork-a-repo/) and to [syncing a fork](https://help.github.com/articles/syncing-a-fork/).

If you have any questions or just want to chat, please join our team [fa_open_source](https://keybase.io/team/fa_open_source) on Keybase for community discussion. Keybase is a great platform for encrypted chat and file sharing.

## Other

This contributing guide is based on the guidelines of the [SuperCollider contributing guide](https://raw.githubusercontent.com/supercollider/supercollider/develop/CONTRIBUTING.md).
