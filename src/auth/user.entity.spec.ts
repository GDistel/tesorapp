import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User;
        bcrypt.compare = jest.fn();
    })
    describe('validatePassword', () => {

        it('returns true if password is valid', async () => {
            bcrypt.compare.mockReturnValue(true);
            expect(bcrypt.compare).not.toHaveBeenCalled();
            const result = await user.validatePassword('TestPassword');
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toBe(true);
        });
        it('returns true if password is invalid', async () => {
            bcrypt.compare.mockReturnValue(false);
            expect(bcrypt.compare).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword');
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

});