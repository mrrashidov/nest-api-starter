import { Knex } from 'knex';

const activities = [
  {
    user_id: 0,
    action: 'create',
    trackable_id: 1,
    trackable_name: 'users',
  },
  {
    user_id: 0,
    action: 'create',
    trackable_id: 2,
    trackable_name: 'users',
  },
];

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([
    knex('activities').del(),
    knex('activities').insert(activities),
  ]);
}
