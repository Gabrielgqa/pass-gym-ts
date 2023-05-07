import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';

export async function register(request: FastifyRequest, replay: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const prismaUsersRepository = new PrismaUsersRepository();
        const registerUseCase = new RegisterUseCase(prismaUsersRepository);

        await registerUseCase.execute({
            name,
            email,
            password
        });
    } catch (err) {
        return replay.status(409).send();
    }
    
    return replay.status(201).send();
}