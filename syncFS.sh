#! /bin/bash

# get content root
root=$(egrep 'FS_ROOT=.*' <.env | sed 's/FS_ROOT=//; s/"//g')

[[ ! -d $root ]] && echo "Content root non-existent@" && exit 1

cd $root
git pull
