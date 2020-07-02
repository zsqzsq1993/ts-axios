#!/usr/bin/env sh

set -e

echo "Enter release version:"
read -r VERSION
read -p "Are you sure releasing version $VERSION?(y/n)" -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing version $VERSION"

  # commit
  git add -A
  git commit -m "[build] version $VERSION"
  git push origin master

  npm publish
fi
