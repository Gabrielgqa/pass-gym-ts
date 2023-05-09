import { hash } from 'bcryptjs';

import { UserRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private userRepository: UserRepository){
    }

    async execute({ name, password, email }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6);
    
        const userWithSameEmail = await this.userRepository.findByEmail(email);
    
        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }
    
        const user = await this.userRepository.create({name, email, password_hash});

        return {
            user
        };
    }
}