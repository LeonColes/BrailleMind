FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --registry=https://registry.npmjs.org/
COPY .output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
# CMD ["npm run", "preview"]