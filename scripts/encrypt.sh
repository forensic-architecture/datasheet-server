#!/bin/bash
travis encrypt-file .env --add --force
git add .env.enc
git commit -m "add encrypted private key for travis testing"
