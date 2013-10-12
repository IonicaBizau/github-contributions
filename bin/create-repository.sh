echo "Hello"
cd $1
echo "Entered: " $1
echo "Removing already generated-repo."
rm -rf $2
echo "Creating a new repo"
mkdir $2
cd $2
git init
echo "Hello Wolrd" >> README.md
git add .
git commit -m "Initial commit"
