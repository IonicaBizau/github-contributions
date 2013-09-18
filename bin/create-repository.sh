echo "Hello"
cd $1
echo "Entered: " $1
echo "Removing already generated-repo."
rm -rf generated-repo
echo "Creating a new repo"
mkdir generated-repo
cd generated-repo
git init
echo "Hello Wolrd" >> README.md
git add .
git commit -m "Initial commit"
