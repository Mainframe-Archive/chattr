#Useful Commands:

$ docker build . -t dleonard00/swarm:client-side-mru
$ docker run -ti -v "/tmp":/tmp -p 8500:8500 dleonard00/swarm:client-side-mru ./start_swarm_node.sh /tmp