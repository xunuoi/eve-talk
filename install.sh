#!bash

#download reids
wget http://download.redis.io/releases/redis-3.2.0.tar.gz

tar xzf ./redis-3.2.0.tar.gz
mv -f redis-3.2.0 ../
cd ../redis-3.2.0
make
cd -
rm redis-3.2.0.tar.gz

# install sails
npm install sails -g
npm install

npm install iconv

# install gulp
npm install gulpman

git reset --hard ./package.json