
[![gh-contributions](http://i.imgur.com/w6nVEgj.png)](#)

# `$ gh-contributions`

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/gh-contributions.svg)](https://www.npmjs.com/package/gh-contributions) [![Downloads](https://img.shields.io/npm/dt/gh-contributions.svg)](https://www.npmjs.com/package/gh-contributions) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A tool that generates a repository which being pushed into your GitHub account creates a nice contributions calendar.

## Installation
### Global installation

[Ensure you configured NPM and NodeJS not to require `sudo` when installing packages globally](https://github.com/IonicaBizau/dotfiles#npm-config).

```js
$ npm i -g gh-contributions
```

To start the GitHub contributions server, do:

```js
$ gh-contributions
```
### Notes for installing on Windows

For this application to work well on Windows, Git must be installed with the option to put it in `PATH` enabled, like in this screenshot:

![](http://i.imgur.com/UOkx35j.png)


If Git is not installed with this option selected, *gh-contributions* will not be able to generate the repository.

### Local installation
```js
$ git clone git@github.com:IonicaBizau/github-contributions.git
$ cd github-contributions
$ npm i
$ npm start
```
## Usage

The server runs on the `9000` port. Open `http://localhost:9000/` in your browser.

Check the help information on the app page (`http://localhost:9000`), after you start the app.

### Running Server Inside Docker Container

**You will need to use a version lower than `3.0.0` to run this in Docker. Currently this is not supported anymore.**


Build Docker container locally:

```sh
docker build -t github-contributions .
```

Start Docker container:

```sh
docker run --rm -it -p 127.0.0.1:9000:9000 --name=github-contributions-server github-contributions
```

Open `http://localhost:9000/` in your browser.


## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`auto-contribution`](https://github.com/aleen42/auto-contribution#readme) (by aleen42)—automatically generate contributions with shell script

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2013#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
