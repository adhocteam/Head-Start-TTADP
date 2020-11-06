import db, { User } from '../models';
import findOrCreateUser from './accessValidation';
import logger from '../logger';

jest.mock('../logger', () => (
  {
    error: jest.fn(),
  }));

describe('findOrCreateUser', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });
  afterAll(async () => {
    await User.destroy({ where: {} });
    db.sequelize.close();
  });
  it('Finds an existing user when a matching user exists', async () => {
    const user = {
      hsesUserId: '33',
      email: 'test@test.com',
      homeRegionId: 3,
    };
    // Verify that there are no users
    const originalUsers = await User.findAll();

    expect(originalUsers.length).toBe(0);

    const createdUser = await findOrCreateUser(user);

    expect(createdUser).toBeInstanceOf(User);

    // Verify that once the user exists, it will be retrieved
    const retrievedUser = await findOrCreateUser(user);
    const allUsers = await User.findAll();

    expect(retrievedUser.hsesUserId).toEqual(user.hsesUserId);
    expect(retrievedUser.email).toEqual(user.email);
    expect(allUsers.length).toBe(1);
  });

  it('Creates a new user when a matching user does not exist', async () => {
    const user = {
      hsesUserId: '33',
      email: 'test@test.com',
      homeRegionId: 3,
    };
    // Check that the above `user` doesn't exist in the DB yet.
    const existingUser = await User.findOne({
      where: {
        hsesUserId: user.hsesUserId,
      },
    });

    expect(existingUser).toBeNull();

    // Now find or create `user2`, and confirm that a new user was created
    const createdUser = await findOrCreateUser(user);

    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toEqual(user.email);

    // Look up the user that was just created, make sure it can now be found
    const existingUserAfter = await User.findOne({
      where: {
        id: createdUser.id,
      },
    });
    expect(existingUserAfter).toBeInstanceOf(User);
  });

  it('Throws when there is something wrong', async () => {
    await expect(() => findOrCreateUser(undefined)).rejects.toBeInstanceOf(Error);
  });

  it('Logs an error message on error', async () => {
    const user = {
      hsesUserId: '33',
      email: 'invalid',
      homeRegionId: 3,
    };
    await expect(findOrCreateUser(user)).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith('SERVICE:ACCESS_VALIDATION - Error finding or creating User in database.');
  });
});
