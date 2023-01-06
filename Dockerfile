FROM node:18.12.1-buster

RUN apt-get update

RUN apt-get install -y \
    p7zip-full \
    language-pack-zh-hans

RUN locale-gen zh_TW.UTF-8  
ENV LC_ALL=zh_TW.UTF-8

# COPY package.json /
# RUN npm install

CMD ["bash"]