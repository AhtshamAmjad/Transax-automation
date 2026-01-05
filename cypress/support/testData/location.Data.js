import { faker } from '@faker-js/faker';
import { generateUSPhoneNumber } from './utilis';

export const getLocationData = () => ({
  locationName: faker.location.city() + ' Branch',
  phone: generateUSPhoneNumber(),
  locationCode: faker.string.alpha({ length: 3, casing: 'upper' }),
  zipCode: faker.location.zipCode('#####'),
});

