const { Product, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('User model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
      it('should work when its a valid name', () => {
        Product.create({ name: 'Producto' });
      });
    });
  });

