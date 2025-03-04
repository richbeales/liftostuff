FROM python:3.11-alpine

# System dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache make g++ bash git openssh postgresql-dev curl

# Set up working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Python dependencies
COPY ./requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./ /usr/src/app

# Expose port
EXPOSE 5000

# Set Python path
ENV PYTHONPATH "${PYTHONPATH}:/usr/src/app;"

# Run Flask application with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
