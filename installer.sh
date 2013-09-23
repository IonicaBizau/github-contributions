echo "Welcome to Github contributions!"
sleep 2
echo "Making gh-contributions directory in ~/"
rm -rf ~/gh-contributions
mkdir ~/gh-contributions
echo "... entering ~/gh-contributions"
cd ~/gh-contributions

echo "... downloading"
# If wget is not present, use curl.
wget https://github.com/IonicaBizau/gh-contributions/archive/master.zip || curl -OL https://github.com/IonicaBizau/gh-contributions/archive/master.zip

echo "... unzipping"
unzip master.zip
mv gh-contributions-master/* ./
npm install
rm -rf gh-contributions-master master.zip
echo "Sucessfully installed. Please type: cd ~/gh-contributions"
echo "Bye!"
