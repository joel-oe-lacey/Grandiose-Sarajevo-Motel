import chai from 'chai';
const expect = chai.expect;
import Manager from '../manager.js';

describe('Manager', function () {
  let manager;

  beforeEach(() => {
    manager = new Manager();
  });

  it('should be a function', () => {
    expect(Manager).to.be.a('function');
  });
})