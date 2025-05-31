#!/bin/bash

echo "🔨 Running 'npm run build' in current folder ($(pwd))..."
if npm run build; then
  echo "✅ Build succeeded!"
else
  echo "❌ Build failed. Aborting."
  exit 1
fi

COMPOSE_FILE="../bfi-infrastructure/docker-compose.development.yaml"

echo "📋 Listing all services in $COMPOSE_FILE..."
all_services=$(docker-compose -f "$COMPOSE_FILE" config --services)

if [ -z "$all_services" ]; then
  echo "❌ No services defined in $COMPOSE_FILE. Exiting."
  exit 1
fi

echo "🔍 All services found:"
echo "$all_services" | sed 's/^/  - /'

services=$(echo "$all_services" | grep '^bfi-dev-service-')

if [ -z "$services" ]; then
  echo "❌ No services found starting with 'bfi-dev-service-'. Nothing to start."
  exit 1
fi

echo "🚀 Found the following bfi-dev-service-* services to start:"
echo "$services" | sed 's/^/  - /'

echo "⏳ Starting services now..."
docker-compose -f "$COMPOSE_FILE" up --build -d $services

if [ $? -eq 0 ]; then
  echo "✅ Successfully started all bfi-dev-service-* services!"
else
  echo "❌ Failed to start some services. Check logs for details."
  exit 1
fi
