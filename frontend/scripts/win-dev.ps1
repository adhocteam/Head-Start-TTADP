docker build -t head-start-dev -f Dockerfile.win .
docker run --privileged --network host --rm -d -v $(pwd):/app --name frontend-dev head-start-dev
docker exec -it frontend-dev sh
