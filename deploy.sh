#!/bin/bash

sudo npm install -g grunt-cli
sudo npm install
sudo script/full-build
mkdir -p ./dist
(cd ./build && tar -zcvf ../dist/blockly-mooc.tgz ./package)
git rev-parse HEAD > .cache_bust
