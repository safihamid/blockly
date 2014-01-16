#!/bin/bash

sudo npm install -g grunt-cli
npm install
script/full-build
mkdir -p ./dist
(cd ./build && tar -zcvf ../dist/blockly-mooc.tgz ./package)
