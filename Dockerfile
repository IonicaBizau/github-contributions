FROM node:5.7.1-onbuild

ENV SERVER_ADDRESS=0.0.0.0
EXPOSE 9000
CMD ["npm", "start"]
