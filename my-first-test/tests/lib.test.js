//docs on: https://jestjs.io/docs/en/getting-started
const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => { //Used for grouping tests

    it('should return posite if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return posite if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('should return 0 if input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});


describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Pedro');

        //When testing strings make sure your test is not too specific
        //expect(result).toBe('Welcome Pedro'); // Avoid this. Too specific
        expect(result).toMatch(/Pedro/); //Will continue working if message changes
        expect(result).toContain('Pedro'); //Will continue working if message changes
    })
});

describe('getCurrencies', () => {
    it('Should return supported currencies', () => {
        const result = lib.getCurrencies();

        // expect(result).toContain('USD');
        // expect(result).toContain('AUD');
        // expect(result).toContain('EUR');

        //Does the same as the above but in a better way
        expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'AUD']));
    })
});

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);

        //expect(result).toEqual({id: 1, price: 10}); //Needs to have those exactly 2 properties. Too specific
        expect(result).toMatchObject({ id: 1, price: 10 }); //Need to have those 2 properties, but can it have others too. Right size.

        expect(result).toHaveProperty('id', 1); //Needs to have only this property
    })
});

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        const args = [null, undefined, NaN, '', 0, false]; //all falsy values in javascript
        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow();
        })
    })

    it('should return a user object if valid username is passed', () =>{
        const user = lib.registerUser('Pedro');
        expect(user).toHaveProperty('username', 'Pedro');
        expect(user.id).toBeGreaterThan(0);
    });
});

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        const order = {customerId: 1, totalPrice: 10};

        db.getCustomerSync = function(customerId){
            console.log('Fake reading customer...');
            return { id: customerId, points: 20};
        }
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
})

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {

        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a'});
        mail.send = jest.fn();

        lib.notifyCustomer({customerId: 1})

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a'); //In the first call to the function, the first argument must be a
        expect(mail.send.mock.calls[0][1]).toMatch(/order/); //In the first call to the function, the first argument must be a

    });
})
