#!/usr/bin/env zsh

set -e
setopt extended_glob

SCRIPT_PATH=${0:A}
SCRIPT_DIR=${SCRIPT_PATH:h}
LATEST_AGENT=(${SCRIPT_DIR}/agent(|-*)(/Nom[1]))
USB_DIR=${LATEST_AGENT}/packages/usb

cd $USB_DIR

fname=$1.ts
if [[ -x $fname ]]; then
	shift
	mise exec -- ./$fname "$@"
elif [[ "$1" == "--list-commands" ]]; then
	print -l *.ts | sed -e $'s/^/\t/' -e 's/\.ts$//'
else
	echo "Usage"
	echo "\t${0} command|--list-commands"
fi
