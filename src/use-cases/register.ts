import { hash } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export async function registerUseCase({ name, password, email }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(userWithSameEmail) {
        throw new Error('E-mail already exists.');
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
        },
    });
}