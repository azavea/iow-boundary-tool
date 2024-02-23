FROM python:3.8-slim-bookworm

RUN mkdir -p /usr/local/src
WORKDIR /usr/local/src
COPY requirements.txt /usr/local/src/

RUN set -ex \
    && buildDeps=" \
       build-essential \
       libgdal-dev \
       libpq-dev \
    " \
    && deps=" \
       gdal-bin \
       gettext \
       postgresql-client \
    " \
    && apt-get update && apt-get install -y $buildDeps $deps --no-install-recommends \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove $buildDeps \
       $(! command -v gpg > /dev/null || echo 'gnupg dirmngr') \
    && rm -rf requirements.txt /var/lib/apt/lists/*

ENTRYPOINT ["/usr/local/bin/gunicorn"]

COPY . /usr/local/src

CMD ["-b :8181", \
"--workers=2", \
"--timeout=60", \
"--access-logfile=-", \
"--access-logformat=%({X-Forwarded-For}i)s %(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s \"%(f)s\" \"%(a)s\"", \
"--error-logfile=-", \
"--log-level=info", \
"--capture-output", \
"iow.wsgi"]
