FROM node:18.12.1-buster

RUN apt-get update

RUN apt-get install -y \
    p7zip-full

# COPY package.json /
# RUN npm install

CMD ["bash"]