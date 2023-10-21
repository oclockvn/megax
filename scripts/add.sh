#! /usr/bin/bash

if [ -z "$@" ]
then
  echo "Migration name is missing"
  exit
fi

dotnet ef migrations add $@ -s src/megax/MegaApp/ -p src/megax/MegaApp.Core/
