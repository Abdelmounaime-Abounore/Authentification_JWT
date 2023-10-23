const { register } = require('../controllers/authContoller');
const Role = require('../models/role'); 
const User = require('../models/user'); 

describe('register function', () => {
  it('should return success message when user is registered', async () => {
    
    const req = {
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Main St',
        image: 'avatar.jpg',
        roleName: 'admin', 
      },
    };

    Role.findOne = jest.fn().mockResolvedValue({ _id: '652e4b682547cf7e2afe4045' });

    User.prototype.save = jest.fn().mockResolvedValue({});

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    // Expectations
    expect(Role.findOne).toHaveBeenCalledWith({ name: 'admin' });
    expect(User.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully.' });
  });

  it('should return error message for invalid role', async () => {
    const req = {
      body: {
        roleName: 'manager', 
      },
    };

    Role.findOne = jest.fn().mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(Role.findOne).toHaveBeenCalledWith({ name: 'manager' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role.' });
  });

});