FROM quay.io/azavea/django:3.2-python3.8-slim

RUN mkdir -p /usr/local/src
WORKDIR /usr/local/src
COPY requirements.txt /usr/local/src/

RUN set -ex \
    && pip install --no-cache-dir -r requirements.txt

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
