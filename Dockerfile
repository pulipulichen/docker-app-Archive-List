FROM node:18.12.1-buster

RUN apt-get update

RUN apt-get install -y \
    p7zip-full \
    language-pack-zh-hans

RUN locale-gen C.UTF-8  
ENV LC_ALL=C.UTF-8
RUN echo "export LANG=C.UTF-8 >> /etc/profile"

# COPY package.json /
# RUN npm install

CMD ["bash"]