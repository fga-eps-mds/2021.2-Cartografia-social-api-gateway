dev-run:
	docker-compose up gateway-dev rabbitmq mongo

dev-build:
	docker-compose up --build gateway-dev rabbitmq mongo

dev-build:
	docker-compose up --build gateway-dev rabbitmq mongo

debug-build:
	docker-compose up --build gateway-debug rabbitmq mongo

debug-run:
	docker-compose up gateway-debug rabbitmq mongo
