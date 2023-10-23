const { login } = require('../controllers/authContoller');
const User = require('../models/user'); 
const jwtToken = require('../../utils/jwtToken'); 
const sendEmail = require('../../utils/sendEmail'); 

describe('login function', () => {
  it('should return a success message and set a cookie for valid login', async () => {
    const req = {
      body: {
        email: 'email@example.com',
        password: 'password',
      },
    };

    User.findOne = jest.fn().mockResolvedValue({
      _id: 'user123',
      name: 'John Doe',
      role: {
        name: 'admin',
      },
      password: 'password',
      isVerified: true,
      email: 'email@example.com',
    });

    jwtToken.generate = jest.fn().mockReturnValue('mockedToken123');

    sendEmail.sendEmail = jest.fn();

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    await login(req, res);

    // Expectations
    expect(User.findOne).toHaveBeenCalledWith({ email: 'email@example.com' });
    expect(jwtToken.generate).toHaveBeenCalledWith('user123', '30m');
    expect(sendEmail.sendEmail).not.toHaveBeenCalled(); 
    expect(res.cookie).toHaveBeenCalledWith('jwtToken', 'mockedToken123', { exp: '30m' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Welcome John Doe, your are admin' });
  });

  it('should return a success message and send a verification email for an unverified user', async () => {
    
    const req = {
      body: {
        email: 'unverified@example.com',
        password: 'password',
      },
    };

    User.findOne = jest.fn().mockResolvedValue({
      _id: 'user123',
      name: 'Jane Smith',
      role: {
        name: 'admin',
      },
      password: 'Password',
      isVerified: false,
      email: 'unverified@example.com',
    });

    // Mock the jwtToken.generate function to return a token
    jwtToken.generate = jest.fn().mockReturnValue('mockedToken456');

    // Mock the sendEmail.sendEmail function
    sendEmail.sendEmail = jest.fn();

    // Create a mock response object
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    // Call the login function
    await login(req, res);

    // Expectations
    expect(User.findOne).toHaveBeenCalledWith({ email: 'unverified@example.com' });
    expect(jwtToken.generate).toHaveBeenCalledWith('user123', '30m');
    expect(sendEmail.sendEmail).toHaveBeenCalledWith(
      'unverified@example.com',
      'Email Verification',
    );
    expect(res.cookie).toHaveBeenCalledWith('jwtToken', 'mockedToken456', { exp: '30m' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please check your email' });
  });

  it('should return an error message for invalid login', async () => {

    // Create a mock request object with invalid login data
    const req = {
      body: {
        email: 'invalid@example.com',
        password: 'incorrectPassword',
      },
    };

    // Mock the User model's findOne method to return null (user not found)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Create a mock response object
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    // Call the login function

    await login(req, res);

    // Expectations

    expect(User.findOne).toHaveBeenCalledWith({ email: 'invalid@example.com' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Info Invalide' });
    // Verify that other functions (jwtToken.generate and sendEmail.sendEmail) were not called

    expect(jwtToken.generate).not.toHaveBeenCalled();
    expect(sendEmail.sendEmail).not.toHaveBeenCalled();
  });

});