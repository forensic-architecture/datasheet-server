#!/bin/bash
travis encrypt-file .env --add --force
git add .env.enc
git commit -m "TRAVIS: add encrypted key"
