GitHub Contributions
====================

A simple application that generates a repository that being added into your GitHub account creates a nice contributions calendar.

Installation
------------

    wget -qO- https://raw.github.com/IonicaBizau/github-contributions/master/installer.sh | sh

If your system does not have _wget_, you can also use _curl_:

    curl https://raw.github.com/IonicaBizau/github-contributions/master/installer.sh | sh

Usage
-----

The installer script will create a folder in `home` called `github-contributions`. So enter in that folder (`cd ~/github-contributions`) and run `node server` or directly:

```
node ~/github-contributions/server.js
```

The application runs on the port `9000`. Open your browser at `http://localhost:9000/` there you will see the contribution designer. You will draw the commits. A JSON object is generated:

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
Then click the generate button and wait... :-) You can delight with the debug messages from terminal while the repository is generated.

After the repository is finished you will get a link for download. Unzip the zip file, add your remote git repository and run `git push -u origin master`.

Example
-------

Design your GitHub contributions calendar using the designer from the browser:

![](http://i.imgur.com/n5gjb0T.png)

A repo will be generated. After pushing it to GitHub, your profile will look like this:

![](http://i.imgur.com/Z8c1Ed0.png)
