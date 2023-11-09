deploy:
	docker build -t codemaze-web -f Dockerfile.deploy .
	docker run\
		--name codemaze-web\
		-d\
		--restart unless-stopped\
		-p 80:3000\
		codemaze-web
stop-deploy:
	docker stop codemaze-web
	docker rm codemaze-web
debug:
	docker build -t codemaze-web-debug -f Dockerfile.debug .
	docker run\
		--name codemaze-web-debug\
		--restart unless-stopped\
		-p 3000:3000\
		-v ./:/codemaze-web\
		codemaze-web-debug
stop-debug:
	docker stop codemaze-web-debug
	docker rm codemaze-web-debug
