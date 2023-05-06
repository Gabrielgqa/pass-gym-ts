import { FastifyInstance } from 'fastify';
import { register } from './controllers/register.ctrl';

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register);
}