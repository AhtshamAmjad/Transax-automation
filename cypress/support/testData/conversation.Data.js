import { faker } from '@faker-js/faker';
import { generateUSPhoneNumber } from './utilis';

export const getConversationUser = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'transax.test' }).toLowerCase(),
  phone: generateUSPhoneNumber(),
});
