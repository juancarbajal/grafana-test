FROM alpine:3.13
# CMD '/bin/sh -c "while true; do sleep 5 ;echo hello_world; done"'
# ENTRYPOINT ["sh", "-c"]
CMD ["sh", "-c", "while true; do echo 'Container is running'; sleep 1; done"]
