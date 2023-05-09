import { FastifyInstance } from 'fastify';
import { register } from './controllers/register.ctrl';
import { authenticate } from './controllers/authenticate.ctrl';

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);
}