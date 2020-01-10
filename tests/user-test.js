import chai from 'chai';
const expect = chai.expect;
import User from '../user.js';

describe('User', function () {
  let user;

  beforeEach(() => {
    user = new User({
      id: 1,
      name: "Leatha Ullrich"
    });
  });

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have an ID', () => {
    expect(user.id).to.equal(1);
  });  

  it('should have a name', () => {
    expect(User).to.equal('Leatha Ullrich');
  });  
})