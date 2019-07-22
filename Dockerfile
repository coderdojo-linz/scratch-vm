FROM node AS builder
COPY . /app/scratch-vm
WORKDIR /app/scratch-vm
RUN npm install \
    && npm run build \
    && npm link
WORKDIR /app
RUN git clone https://github.com/coderdojo-linz/scratch-gui.git --depth 1 -b ars-ai \
    && cd scratch-gui \
    && npm install \
    && npm link scratch-vm \
    && npx webpack --progress --colors --bail

FROM nginx:alpine
COPY --from=builder /app/scratch-gui/build /usr/share/nginx/html
