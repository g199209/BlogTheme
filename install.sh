#! /bin/bash

echo "Copying configuration files..."
rm ../../_config.yml
ln ./_config_root.yml ../../_config.yml
mkdir ../../source/404
ln ./404.md ../../source/404/404.md
mkdir ../../source/tags
ln ./tag_index.md ../../source/tags/index.md
ln ./wechat.md ../../source/wechat.md
echo "gaomf.cn" >> ../../source/CNAME

echo "Copying markdown templates..."
rm ../../scaffolds/*
ln ./template.md ../../scaffolds/post.md
ln ./template.md ../../scaffolds/draft.md

echo "Cloning source posts..."
rm -r ../../source/_posts
git clone git@github.com:g199209/BlogMarkdown.git ../../source/_posts

echo "Installing hexo plugins..."
old_path=`pwd`
cd ../..
npm install hexo-generator-sitemap --save
npm install hexo-generator-feed --save
npm install hexo-generator-search --save
npm install hexo-deployer-git --save
cd $old_path

echo "Patching hexo-generator-search..."
cat ./search_patch.js >> ../../node_modules/hexo-generator-search/index.js
cp ./search_template.ejs ../../node_modules/hexo-generator-search/templates/xml.ejs

echo "All Done."
