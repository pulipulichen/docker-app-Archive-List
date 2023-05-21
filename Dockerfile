FROM node:20.2.0-bullseye

RUN apt-get update

RUN apt-get install -y \
    p7zip-full locales locales-all

RUN locale-gen C.UTF-8  
ENV LC_ALL=C.UTF-8
ENV LC_LAGNlo=C.UTF-8
RUN echo "export LANG=C.UTF-8" >> /etc/profile

# COPY package.json /
# RUN npm install

RUN localedef -c -f UTF-8 -i zh_TW zh_TW.utf8

CMD ["bash"]

RUN apt-get install -y unzip