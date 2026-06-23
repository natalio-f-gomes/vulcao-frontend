#!/bin/bash

npx playwright --version
npm install -D @playwright/test@latest
npx playwright install --with-deps
npx playwright --version