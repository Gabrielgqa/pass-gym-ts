import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AutenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const autenticateUseCase = new AutenticateUseCase(usersRepository);

    return autenticateUseCase;
}