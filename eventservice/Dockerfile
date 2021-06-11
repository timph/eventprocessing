FROM FROM alpine:3.11

ARG GITHUB_TOKEN
ARG GIT_COMMIT
ARG SENTRY_AUTH_TOKEN

ENV APP_VERSION $GIT_COMMIT
ENV NODE_ENV production

# CERES deployment expects this file to be here
USER root
COPY bin/docker-entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

USER node

# node user only has access to /home
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock tsconfig.json relay.config.js .npmrc babel.config.js globals.d.ts .sentryclirc ./

COPY --chown=node:node src/ src/
COPY --chown=node:node prisma/ prisma/
COPY --chown=node:node __migrations__/ __migrations__/

RUN yarn --production=false \
    && rm .npmrc \
    # start security cleanup
    && grep -lrE "BEGIN ?(.*) PRIVATE KEY" node_modules | grep -Ev "\.js$" | xargs rm -fv \
    && rm -rf $(yarn cache dir) \
    # end security cleanup
    && yarn run-s generate cjs \
    && yarn sentry-cli releases files $APP_VERSION upload-sourcemaps . --ignore node_modules \
    && yarn sentry-cli releases finalize $APP_VERSION

CMD ["node", "dist/src/run/service"]