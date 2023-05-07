import { hash } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUseCase {
    constructor(private userRepository: any, ){

    }

    async execute({ name, password, email }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6);
    
        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });
    
        if(userWithSameEmail) {
            throw new Error('E-mail already exists.');
        }
    
        await this.userRepository.create({name, email, password_hash});
    }
}