GitHub Contributions
====================
An application that generates a repository that being added into your GitHub
account creates a nice contributions calendar.

Installation
------------

```sh
$ git@github.com:IonicaBizau/github-contributions.git
$ cd github-contributions
$ npm install
$ node server
```

Usage
-----
Once the application is started, open `localhost:9000` in your browser and
draw your calendar.

```JSON
{
    "coordinates": [
        {
            "x": ...,
            "y": ...
        },
        ...
        {
            ...
        }
    ],
    "commitsPerDay": 40
}
```

Edit the `commitsPerDay` value. That sets the day commit count.
Then click the generate button and wait... :smile:

In the background, a git repository is created and fake commits are generated
on known dates. After finishing, you will get a download link.

You will download the zip file that contains the repository. Unzip it and push
it into your GitHub account.

## Screenshots

### Calendar designer
![](http://i.imgur.com/n5gjb0T.png)

### GitHub Calendar
![](http://i.imgur.com/Z8c1Ed0.png)
