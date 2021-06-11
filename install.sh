#! /bin/bash

enc_key="1234567890"

echo "Copying configuration files..."
rm ../../_config.yml
ln ./_config_root.yml ../../_config.yml
rm ../../package.json
ln ./package.json ../../package.json
mkdir ../../source/404
ln ./404.md ../../source/404/404.md
mkdir ../../source/tags
ln ./tag_index.md ../../source/tags/index.md
ln ./wechat.md ../../source/wechat.md
echo "gaomf.cn" >> ../../source/CNAME

echo "Decrypting enc config..."
openssl aes-256-cbc -base64 -k ${enc_key} -md sha256 -d -in _config_enc -out ../../_config_enc.yml

echo "Copying markdown templates..."
rm ../../scaffolds/*
ln ./template.md ../../scaffolds/post.md
ln ./template.md ../../scaffolds/draft.md

echo "Cloning source posts..."
rm -rf ../../source/_posts
git clone git@github.com:g199209/BlogMarkdown.git ../../source/_posts

echo "Installing hexo plugins..."
old_path=`pwd`
cd ../..
npm install
cd $old_path

echo "All Done."
