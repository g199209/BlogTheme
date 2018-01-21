#! /bin/bash

echo "Copying configuration files..."
rm ../../_config.yml
ln ./_config_root.yml ../../_config.yml
mkdir ../../source/404
ln ./404.md ../../source/404/
echo "gaomingfei.xyz" >> ../../source/CNAME

echo "Copying markdown templates..."
rm ../../scaffolds/*
ln ./template.md ../../scaffolds/post.md
ln ./template.md ../../scaffolds/draft.md

echo "Cloning source posts..."
rm -r ../../source/_posts
git clone git@github.com:g199209/BlogMarkdown.git ../../source/_posts

echo "Installing hexo plugins..."
sudo npm install hexo-generator-sitemap --save
sudo npm install hexo-generator-feed --save
sudo npm install hexo-generator-search --save

echo "Patching hexo-generator-search..."
cat ./search_patch.js >> ../../node_modules/hexo-generator-search/index.js
cp ./search_template.ejs ../../node_modules/hexo-generator-search/templates/xml.ejs

echo "All Done."
