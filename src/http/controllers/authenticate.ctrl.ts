import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(request: FastifyRequest, replay: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const autenticateUseCase = makeAuthenticateUseCase();

        await autenticateUseCase.execute({
            email,
            password
        });
    } catch (err) {
        if(err instanceof InvalidCredentialsError) {
            return replay.status(400).send({ message: err.message });
        }

        throw err;
    }
    
    return replay.status(200).send();
}