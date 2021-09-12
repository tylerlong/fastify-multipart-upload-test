import Fastify from 'fastify';
import fastifyMultipart from 'fastify-multipart';

const fastify = Fastify();
fastify.register(fastifyMultipart);

fastify.listen(8090, '0.0.0.0');
