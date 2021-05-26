// jest.mock('./UserResolver');

import { UserResolver } from './UserResolver';

const User = new UserResolver();

it(
    'We should get the user associated to the id',
    async () => {
        // expect.assertions(1);
        const data = await User.getUserById("608a7c08a63cc35a88514552");
        console.log(data);
        if (data !== null) {
            expect(data.firstname).toEqual("Catherine");
        }
    }
)