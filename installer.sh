echo "Welcome to Github contributions!"
sleep 2
echo "Making gh-contributions on ~/ directory"
rm -rf ~/gh-contributions
mkdir ~/gh-contributions
echo "...entering there"
cd ~/gh-contributions
echo "...downloading"
wget https://github.com/IonicaBizau/gh-contributions/archive/master.zip
echo "...unziping"
unzip master.zip
mv contributions-master/* ./
npm install
rm -rf contributions-master master.zip
echo "Sucessfully installed. Please type: cd ~/gh-contributions"
echo "Bye!"
