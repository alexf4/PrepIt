FROM        ubuntu:14.04

MAINTAINER  Alex k

# INSTALL OS DEPENDENCIES AND NODE.JS
ENV         DEBIAN_FRONTEND noninteractive
RUN         apt-get update; apt-get install -y software-properties-common g++ make
RUN         add-apt-repository -y ppa:chris-lea/node.js
RUN         apt-get update; apt-get install -y nodejs

# COMMIT PROJECT FILES
# ADD         package.json /root/
# ADD         /tests /root/tests
# ADD         app.js /root/
ADD         . /root/

# INSTALL PROJECT DEPENDENCIES
RUN         cd /root; npm install
RUN         cd /root; npm install -g mocha
RUN         cd /root; npm install chai

# TEST THE PROJECT -- FAILURE WILL HALT IMAGE CREATION
RUN         cd /root; npm test

# TESTS PASSED -- CONFIGURE IMAGE
WORKDIR     /root
ENTRYPOINT  ["/usr/bin/npm"]
CMD         ["start"]
EXPOSE      8080