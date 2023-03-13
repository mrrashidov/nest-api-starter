import { Knex } from 'knex';

const users = [
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    phone: '123456789',
    email: 'john@doe.com',
    first_name: 'John',
    last_name: 'Doe',
    password: '$2b$10$Uw2FZgGhsrWKBOK9MhiY4Op2MDZxMZVb.Af74EQ09IY7LuIhp6apO',
    birthday: new Date('1999-08-08'),
    status: 'active',
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=28',
    phone: '123456789',
    email: 'jane@doe.com',
    first_name: 'Jane',
    last_name: 'Doe',
    password: '$2b$10$Uw2FZgGhsrWKBOK9MhiY4Op2MDZxMZVb.Af74EQ09IY7LuIhp6apO',
    birthday: new Date('2002-08-08'),
  },
];

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([knex('users').del(), knex('users').insert(users)]);
}
