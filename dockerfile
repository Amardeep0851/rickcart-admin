FROM node:20

WORKDIR /app

# copy package* .
COPY package.json ./ 
COPY package-lock.json ./
COPY ./prisma .

RUN npm install
RUN npx prisma generate

COPY . ./
RUN npm run build


EXPOSE 3000
CMD ["npm", "run", "dev"]