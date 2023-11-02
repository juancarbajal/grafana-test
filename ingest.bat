docker rm ingest
docker build -f ./ingest.Dockerfile -t ingest:1 .
docker run --log-driver loki --log-opt loki-url=http://localhost:3100/loki/api/v1/push  --name ingest -d ingest:1
