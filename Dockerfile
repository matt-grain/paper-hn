FROM node

# local settings and user
ENV TZ=America/New_York
ENV LANG=en_US.UTF-8 LANGUAGE=en_US.UTF-8
RUN adduser user

# update OS
USER root
RUN apt update

# set nginx
RUN DEBIAN_FRONTEND=noninteractive apt-get install --yes nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /var/lib/nginx
RUN chown -R user:user /var/lib/nginx
RUN chown -R user:user /var/log/nginx

# set app
WORKDIR /home/user
COPY . .
COPY 404.html /home/user/
COPY favicon.ico /home/user/
COPY robots933456.txt /home/user/
COPY game.html /home/user/
COPY game.html /home/user/index.html
COPY game.html /home/user/top.html

# install npm modules
RUN yarn install --modules-folder=/home/user/node_modules

# copy scripts
COPY /scripts/main_loop.sh .
COPY /scripts/harden.sh .
RUN chown -R user:user .
RUN touch /run/nginx.pid && chown -R user:user /run/nginx.pid

RUN ./harden.sh user

USER user
CMD /home/user/main_loop.sh
