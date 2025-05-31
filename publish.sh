npm run build
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi
npm publish --access public
if [ $? -ne 0 ]; then
  echo "Publish failed. Exiting."
  exit 1
fi
echo "Build and publish successful."