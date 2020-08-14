FROM python:3.8.2

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY . /usr/src/app/

RUN apt-get update && \
DEBIAN_FRONTEND=noninteractive apt-get install -y \
                libgdal-dev \
                python3-pip
# Env vars for gdal
ARG CPLUS_INCLUDE_PATH=/usr/include/gdal
ARG C_INCLUDE_PATH=/usr/include/gdal

RUN pip3 install --upgrade pip
RUN pip3 install gdal==$(gdal-config --version)
RUN pip3 install --no-cache-dir -r requirements.txt

ENV TZ Europe/Minsk