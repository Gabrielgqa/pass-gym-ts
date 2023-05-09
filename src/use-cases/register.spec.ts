import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
    it('sould hash user password upon registrations', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(userRepository);

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('it sould not be able to register with same email twice', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(userRepository);

        const email = 'johndoe@example.com';

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        });

        await expect(() => 
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('sould be able to register', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(userRepository);

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });
});