
const { resetPassword } = require('../controllers/authContoller');
const User = require('../models/user'); 
const jwtToken = require('../../utils/jwtToken');

describe('resetPassword function', () => {
  it('should return a success message for a valid token and reset the password', async () => {
    // mock request object with a valid token and password
    const req = {
      params: {
        token: 'validToken123',
      },
      body: {
        password: 'newPassword123',
      },
    };

    // Mock the jwtToken.verify function to return a decoded token with an ID
    jwtToken.verify = jest.fn().mockReturnValue({ id: 'user123' });

    // Mock the User model's findById and save methods
    User.findById = jest.fn().mockResolvedValue({
      _id: 'user123',
      name: 'John Doe',
      password: 'newPassword123',
    });
    User.prototype.save = jest.fn();

    // Create a mock response object
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Call the resetPassword function
    await resetPassword(req, res);

    // Expectations
    expect(jwtToken.verify).toHaveBeenCalledWith('validToken123', '4e8ea0f04e60e27d61df4929a0e0af5cbca31562f0ddb6761b0e278eb3501d10025d65f23df25f5614e1e425a74bab01119e35cac9cd7be41f96fcee3c2242ff'); 
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(User.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password is reset successfully.' });
  });

  it('should return an error message for an invalid token', async () => {
    // Create a mock request object with an invalid token and password
    const req = {
      params: {
        token: 'invalidToken456',
      },
      body: {
        password: 'newPassword123',
      },
    };

    // Mock the jwtToken.verify function to return an empty object (invalid token)
    jwtToken.verify = jest.fn().mockReturnValue({});

    // Create a mock response object
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Call the resetPassword function
    await resetPassword(req, res);

    // Expectations
    expect(jwtToken.verify).toHaveBeenCalledWith('invalidToken456', '4e8ea0f04e60e27d61df4929a0e0af5cbca31562f0ddb6761b0e278eb3501d10025d65f23df25f5614e1e425a74bab01119e35cac9cd7be41f96fcee3c2242ff'); 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
  });

  it('should return an error message for an expired token', async () => {
    // Create a mock request object with an expired token and password
    const req = {
      params: {
        token: 'expiredToken789',
      },
      body: {
        password: 'newPassword123',
      },
    };

    // Mock the jwtToken.verify function to throw a TokenExpiredError
    jwtToken.verify = jest.fn().mockImplementation(() => {
      throw new Error('TokenExpiredError');
    });

    // Create a mock response object
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Call the resetPassword function
    await resetPassword(req, res);

    // Expectations
    expect(jwtToken.verify).toHaveBeenCalledWith('expiredToken789', '4e8ea0f04e60e27d61df4929a0e0af5cbca31562f0ddb6761b0e278eb3501d10025d65f23df25f5614e1e425a74bab01119e35cac9cd7be41f96fcee3c2242ff'); 
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your Token is Expired.' });
  });

});
