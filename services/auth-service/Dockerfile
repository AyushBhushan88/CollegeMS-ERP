FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install
RUN pnpm run build --filter=auth-service...

FROM base AS deploy
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 3001
CMD [ "pnpm", "--filter", "auth-service", "start:prod" ]
