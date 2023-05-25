import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { ResouceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('sould be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.name).toEqual('John Doe');
    });

    it('sould not be able to authenticate with wrong password', async () => {
        expect (() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResouceNotFoundError);
    });
});