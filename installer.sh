echo "Welcome to Github contributions!"
sleep 2
echo "Making github-contributions directory in ~/"
rm -rf ~/github-contributions
mkdir ~/github-contributions
echo "... entering ~/github-contributions"
cd ~/github-contributions

echo "... downloading"
# If wget is not present, use curl.
wget https://github.com/IonicaBizau/github-contributions/archive/master.zip || curl -OL https://github.com/IonicaBizau/github-contributions/archive/master.zip

echo "... unzipping"
unzip master.zip
mv github-contributions-master/* ./
npm install
rm -rf github-contributions-master master.zip
echo "Sucessfully installed. Please type: cd ~/github-contributions; node server.js"
echo "Bye!"
