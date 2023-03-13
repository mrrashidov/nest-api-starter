import { Knex } from 'knex';

const passwordResets = {
  user_id: 1,
  token: '',
  password: '',
  status: 'rejected',
};

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([
    knex('password_resets').del(),
    knex('password_resets').insert(passwordResets),
  ]);
}
