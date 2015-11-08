[![gh-contributions](http://i.imgur.com/w6nVEgj.png)](#)

# gh-contributions [![Support this project][donate-now]][paypal-donations]
A tool that generates a repository which being pushed into your GitHub account creates a nice contributions calendar.

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

## Documentation

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

## License

[KINDLY][license] © [Ionică Bizău][website]

[license]: http://ionicabizau.github.io/kindly-license/?author=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica@gmail.com%3E&year=2013

[website]: http://ionicabizau.net
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md