#!/bin/bash

sudo npm install -g grunt-cli
sudo npm install
sudo script/full-build
mkdir -p ./dist
(cd ./build && tar -zcvf ../dist/blockly-mooc.tgz ./package)
git rev-parse HEAD > .cache_bust

(cd ../dashboard/public; git rm -rf blockly-dist; tar -zxf ../../blockly/blockly-mooc.tgz; mv package blockly-dist; git add blockly-dist; git commit -m "Automatically upgraded blockly-dist."; git push)
