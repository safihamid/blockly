#!/bin/bash

sudo npm install -g grunt-cli
sudo npm install
sudo script/full-build
mkdir -p ./dist
(cd ./build && tar -zcvf ../blockly-mooc.tgz ./package)
