
[![gh-contributions](http://i.imgur.com/w6nVEgj.png)](#)

# `$ gh-contributions`

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Version](https://img.shields.io/npm/v/gh-contributions.svg)](https://www.npmjs.com/package/gh-contributions) [![Downloads](https://img.shields.io/npm/dt/gh-contributions.svg)](https://www.npmjs.com/package/gh-contributions)

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


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)

Thanks! :heart:


## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`auto-contribution`](https://github.com/aleen42/auto-contribution#readme) (by aleen42)—automatically generate contributions with shell script

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[badge_patreon]: http://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: http://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: http://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: http://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(https%3A%2F%2Fionicabizau.net)&year=2013#license-mit
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
