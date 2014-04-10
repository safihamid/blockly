# Blockly 20 Hour Curriculum

Blockly is a web-based, graphical programming editor. Users can drag blocks
together to build an application. No typing required. Credit goes to these
awesome [developers](https://code.google.com/p/blockly/wiki/Credits#Engineers)
and a small army of
[translators](https://code.google.com/p/blockly/wiki/Credits#Translators).

This repository contains the source code for the
[Blockly](https://code.google.com/p/blockly/) based 20 hour curriculum and Hour
of Code. Information about Blockly can be found in the
[wiki](https://code.google.com/p/blockly/w/list).

- [Quick Start](#quick-start)
- [Project Specification](#project-specification)
- [Contribute to Blockly](#to-contribute)


## Quick Start

### Prerequisite: Cairo

One of the node modules, node-canvas, depends on Cairo being installed.

Instructions for MacOSX using [brew](http://brew.sh/) (instructions for other platforms [can be found here](https://github.com/LearnBoost/node-canvas/wiki)):

1. Install [XQuartz from here](http://xquartz.macosforge.org/landing/)
2. `export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/opt/X11/lib/pkgconfig"`
3. `brew update`
4. `brew install cairo`

### Installing Blockly

```
# Get the code
git clone https://github.com/code-dot-org/blockly.git blockly
cd blockly

# Machine setup (OSX with Homebrew)
brew install node
npm install -g grunt-cli

# Build
npm install
MOOC_DEV=1 grunt build
```

### Building during development

#### Full build

To run a full build (minus localization):

```
MOOC_DEV=1 grunt build
```

* `MOOC_DEV=1` builds a 'debug' version with more readable javascript
* `grunt rebuild` does a `clean` before a `build`

#### Run with live-reload server

```
grunt dev
open http://localhost:8000
```

Note: this does not update asset files. For that, use a full `grunt build`.

#### Running tests

```
grunt build # run a build before testing
grunt test
```

* Blockly tests target the `build/js/app_name` folder

### Localization

Since localizing in to many languages dramatically slows down the build, the
default target locales are `en_us` and `en_ploc` (pseudolocalized). To build
all available locales, specify `MOOC_LOCALIZE=1` in your environment:

```bash
MOOC_LOCALIZE=1 grunt rebuild
```

Note: if you're running the `grunt dev` live-reload server and get the error `too many open files` after a localization build, try increasing the OS open file limit by running `ulimit -n 1024` (and adding it to your `.bashrc`).

## Project Specification

Both of these tutorials are found on code.org/learn or csedweek.org/learn. At
the end of 1-hour, you’re sent to a Drupal thank you page that leads you back
to code.org/learn

### 1 hour tutorial

- 18 Maze puzzles + 6 videos, with celeb videos and licensed skins
- No auth/identity/login, no state
- Works on touch-screens, cross-browser (IE9+ required. IE8 highly desired)
- Looks good on smartphones / small screens
- Translated into at least spanish, and other non-bidi languages


### 20-hour curriculum

- X stages, Y puzzles, Z videos
- HAS student auth, teacher auth.
- Student can see a map of where they are. Earn “trophies”
- Teacher can see dashboard of student progress
- Both students and teachers earn real-world rewards upon completion.
- Works on touch-screens, cross-browser (IE9+ required. IE8 highly desired)
- NOT optimized for smartphones / small screens. NOT translated


## Contributing

We'd love to have you join our group of contributors!

For notes on our pull process, where to find tasks to work on, etc.—see the Dashboard [contribution guide](https://github.com/code-dot-org/dashboard#contributing).

### Style Guide

- In general follow Google's javascript style [guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
- 80 character line length.
- 2 space indent.
- 4 space indent on long line breaks.
- `grunt jshint` should report 0 warnings or errors.

## Releases

Compiled distrubutions are published as tarballs to Amazon S3.  You'll need
the [AWS CLI tool][1] and access to the [Code.org secrets][2].  Run
`path/to/secrets/cdo-env ./script/release` to produce a fullly-localized build
in `./build/package`, which will be tared up into `./dist`, stampped with a
git tag, pushed to GitHub, and published on S3.


[1]: http://aws.amazon.com/cli/
[2]: https://github.com/code-dot-org/cdo-secrets
