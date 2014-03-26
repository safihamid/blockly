#!/usr/bin/env ruby
require_relative '../lib/util'

system_ex 'sudo npm install -g grunt-cli'
system_ex 'sudo npm install'
system_ex 'sudo MOOC_LOCALIZE=1 grunt'
system_ex '(cd ./build && tar -zcvf ../blockly-mooc.tgz ./package)'

system_ex '(cd ../dashboard/public; git pull; git rm -rf blockly-dist; tar -zxf ../../blockly/blockly-mooc.tgz; mv package blockly-dist; git add blockly-dist; git commit -m "Automatically upgraded blockly-dist."; git push)'
