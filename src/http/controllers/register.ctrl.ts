import { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export async function register(request: FastifyRequest, replay: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(userWithSameEmail) {
        return replay.status(409).send();
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
        },
    });
    
    return replay.status(201).send();
}