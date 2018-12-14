#!/bin/bash
openssl aes-256-cbc -K $encrypted_4f23b46f1ec6_key -iv $encrypted_4f23b46f1ec6_iv -in .env.enc -out .env -d
