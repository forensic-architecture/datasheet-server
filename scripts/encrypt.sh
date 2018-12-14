#!/bin/bash
travis encrypt-file .env --force
git add .env.enc
git commit -m "TRAVIS: add encrypted key"
