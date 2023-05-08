import { hash } from 'bcryptjs';

import { UserRepository } from '@/repositories/users-repository';

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUseCase {
    constructor(private userRepository: UserRepository){
    }

    async execute({ name, password, email }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6);
    
        const userWithSameEmail = await this.userRepository.findByEmail(email);
    
        if(userWithSameEmail) {
            throw new Error('E-mail already exists.');
        }
    
        await this.userRepository.create({name, email, password_hash});
    }
}