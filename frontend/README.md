# TTADP Frontend

## Getting Started

This project uses [docker](https://docs.docker.com/get-docker/) and [make](https://www.gnu.org/software/make/) to provide a simple unified environment for all developers. To get started:

 1. Make sure you have docker installed
 2. Run `make init`. This will build the development docker image and install the project's dependencies
 3. Run `make start`. This fires up a development server that reloads with code updates

Almost all make targets just call `yarn ...`, minus the integration tests which spin up a server first. Feel free to use `yarn` commands if you are more comfortable doing so.

### Build Commands

| Make Target | Yarn Command | Description |
|-|-|-|
| `make init` | `yarn install` | Install dependencies. (Docker only) Builds docker image |
| `make test` | `yarn test` | Start the test watcher |
| `make build` | `yarn build` | Build a production bundle |
| `make lint` | `yarn eslint src` | Run the linter |
| `make lint-fix` | `yarn eslint src --fix` | Have the linter fix issues it can fix automatically |
| `make serve` | `yarn build` followed by `serve -s build` | Build a production bundle and serve that bundle from `localhost:5000` |
| `make shell` | - | Get a shell into the developer docker container. Sometimes useful to help debug build environment issues |
| `make clean` | `rm -rf build` | Remove the build directory |
| `make ci` | - | Run all "ci" targets. These include `test-ci`, `lint-ci`, `audit` and `zap` |
| `make test-ci` | `yarn test --coverage --reporters=default --reporters=jest-junit` | Run tests as a single run creating coverage and test result reports. Test reports can be found in `reports/unit.xml`. Coverage is in the `coverage` folder (I couldn't find an easy way to change the coverage directory) |
| `make lint-ci` | `yarn eslint -f junit -o reports/lint.xml src` | Run the linter creating a report in `reports/lint.xml` |
| `make audit` | `yarn audit --level moderate` | Run `yarn audit` failing if any dependency has a moderate or higher vulnerability |
| `make zap` | - | Run `script/zap.sh` which launches [zap](https://www.zaproxy.org/) against a production bundle. Outputs a report to `reports/zap.html` |
| `make accessibility` | - | Run `script/accessibility.sh` which runs [pa11y-ci](https://github.com/pa11y/pa11y-ci) against a production build |

### Docker On Windows (WORK IN PROGRESS)

Note that this process has not been extensively tested on windows. I would suggest using the yarn commands on windows instead of trying to get docker working, unless you feel like tinkering with docker and windows. For some reason the `docker build` command when ran from the Docker in Docker (DIND) image takes a **long** time to run. The same `docker build` command from the windows host runs fast. If you are trying to get DIND working on windows that seems like a place to start digging in.

There is an extra step you'll need to take to use the makefile when developing on windows. In the root directory there is a script called `win-dev.ps1`. This powershell script does three things:

 1. It builds a docker image based on the [DIND image](https://hub.docker.com/_/docker), installing `make` along the way
 2. It fires up a container of the image built in step #1, binding in the frontend code in the `/app` directory
 3. Shells into the container that started in step #2

At this point you should be able to run `make init`, `make start` and browse to `localhost:3000` to see the running app.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
