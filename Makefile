## Make targets for Docker Compose

# Choose the Docker Compose command. Override if you use legacy docker-compose.
# Example: make up DC="docker-compose"
DC ?= docker compose

# Compose file to use. Override as needed.
# Example: make up COMPOSE_FILE=docker-compose.dev.yml
COMPOSE_FILE ?= docker-compose.yml

.PHONY: up down restart logs ps build pull

up:
	$(DC) -f $(COMPOSE_FILE) up

down:
	$(DC) -f $(COMPOSE_FILE) down

restart:
	$(DC) -f $(COMPOSE_FILE) down
	$(DC) -f $(COMPOSE_FILE) up -d

logs:
	$(DC) -f $(COMPOSE_FILE) logs -f

ps:
	$(DC) -f $(COMPOSE_FILE) ps

build:
	$(DC) -f $(COMPOSE_FILE) build

pull:
	$(DC) -f $(COMPOSE_FILE) pull