#!/bin/bash

echo "Linking examples"

cd ./examples
pnpm link ../$1
cd ../packages

for PACKAGE in $(ls -d ../packages/*);
do
  echo "Linking $PACKAGE"
  cd $PACKAGE
  pnpm link ../../$1
  cd ..
done
