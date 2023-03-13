import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('password_resets', function (table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.string('token').notNullable();
    table.string('password').notNullable();
    table
      .enum('status', ['accepted', 'rejected', 'pending'])
      .defaultTo('pending');
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('expires_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('password_resets');
}
