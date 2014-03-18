#!/bin/bash

sudo npm install -g grunt-cli
sudo npm install
sudo script/full-build
(cd ./build && tar -zcvf ../blockly-mooc.tgz ./package)

(cd ../dashboard/public; git pull; git rm -rf blockly-dist; tar -zxf ../../blockly/blockly-mooc.tgz; mv package blockly-dist; git add blockly-dist; git commit -m "Automatically upgraded blockly-dist."; git push)
