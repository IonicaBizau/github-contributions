# final commit
cd $1
cat <<EOF >README.md
My GitHub Contributions Calendar
================================
This repository was generated with [GitHub Contributions](https://github.com/IonicaBizau/github-contributions) generator. Thanks, [@IonicaBizau](https://github.com/IonicaBizau).
EOF

git add .
git commit -m 'Added title and description'

# now, zip the file
zip -r $1.zip $1
