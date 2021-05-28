import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

const mockCredentialsDto = {
    username: 'TestUsername',
    password: 'TestPassword',
    email: 'someemail@mail.com'
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ],
        }).compile();
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signup(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('throws a conflict exception if a username already exists', async () => {
            save.mockRejectedValue({ code: '23505' });
            await expect(userRepository.signup(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('throws an internal server error exception if there is an error other than username conflict', async () => {
            save.mockRejectedValue({ code: '11111' }); // unhandled error code
            await expect(userRepository.signup(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {
        let user: User;

        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUsername';
            user.validatePassword = jest.fn()
        });

        it('returns the username if validation is successful', async () => {
            (userRepository.findOne as any).mockResolvedValue(user);
            (user.validatePassword as any).mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(result).toEqual(mockCredentialsDto.username);
        });

        it('returns null if the user cannot be found', async () => {
            (userRepository.findOne as any).mockResolvedValue(null);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null if the password is invalid', async () => {
            (userRepository.findOne as any).mockResolvedValue(user);
            (user.validatePassword as any).mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

})