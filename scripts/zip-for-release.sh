echo "version:"$(cat src/module.json|jq .version)
echo "download:"$(cat src/module.json|jq .download)
git archive --format zip --output dist/module.zip master:src
cp src/module.json dist/