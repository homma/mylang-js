#!/bin/sh

# run prettier for each javascript files

find ${PWD} -name '*.mjs' | while read i; do (prettier ${i} --write &); done
