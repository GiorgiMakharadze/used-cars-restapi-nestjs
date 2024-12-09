import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(() => Promise.resolve([])),
      create: jest.fn((email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      ),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.singup('test@gmail.com', 'test');

    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    (fakeUsersService.find as jest.Mock).mockResolvedValue([
      { id: 1, email: 'a', password: '1' } as User,
    ]);

    await expect(service.singup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
