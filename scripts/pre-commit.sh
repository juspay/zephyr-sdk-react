#!/usr/bin/env bash

set -e

# Running check and validate scripts in commits.
# Validates Typescript compilation, fomating, linting
# test cases and attempts prod build.
BRANCH_NAME=$(git branch | grep '*' | sed 's/* //')

if [[ $BRANCH_NAME != *"no branch"* ]]; then
  pnpm run format:all
  pnpm run lint:all
  git add .
  npx --no -- commitlint --edit "${1}"
fi

finish() {
  result=$?
  # Add cleanup code here
  exit ${result}
}
trap finish EXIT ERR
