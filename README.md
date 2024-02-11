# Monumental home assignment

Check the TASKS directory to understand my process and reasoning.

## How to run

Frontend and backend are in separate directories. You can run them separately.
Frontend is built with [Remix](https://remix.run/)

```bash
cd fe
# Copy .env.local to .env
# to test on a different device fill in your host
cp .env.local .env

nvm use
yarn dev
```

Open one more terminal and run the backend with the following commands:

```bash
nvm use
cd ws
yarn dev
```
