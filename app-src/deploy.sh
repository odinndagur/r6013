# npm run build
npx vite build --base=/r6013/ --mode=production
cp -r ./dist/* ../
git add --all
git commit -am deploy
git push
