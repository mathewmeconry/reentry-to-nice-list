FROM node:12-slim

RUN mkdir -p /home/appuser/
RUN mkdir -p /app

RUN groupadd -r appuser && \ 
    useradd appuser -g appuser && \ 
    chown -R appuser:appuser /home/appuser/ && \ 
    chown -R appuser:appuser /app

# Run everything after as non-privileged user.
USER appuser

WORKDIR /app

COPY --chown=appuser:appuser ./niceValidator /app/

WORKDIR /app/niceValidator
RUN yarn
RUN yarn run build

ENTRYPOINT ["yarn", "start"]
