# AI Overview

## Tool

- Cursor

## Steps

- Fed Cursor the requirements doc
- Instructed Cursor to act as a Principal Full-Stack AI Engineer
- Established tech stack and initial scaffolding plan
- Iteratively developed core functionality of the application step by step

## What went well

- Cursor understood prompts well and executed quickly
- Cursor made reasonable implementation and design instructions
- Cursor was able to execute tasks outside of the project scope (git, terminal, external tools, etc)

## What went poorly

- Documentation was not always updated throughout the sessions (README.md was missing an `npm install` step after structural changes)
- Cursor added a lot of unnecessary comments to the code
- Cursor would start modifying files immediately without verifying the changes
- Cursor encountered a type error with RPC and added @ts-expect-error as a hack because "it does not effect the runtime". When prompted to fix the type errors, it added another bandaid hack instead. The tests failed due to RPC type errors (I am making the assumption that this was related)
