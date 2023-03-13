import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('avatar', 100).nullable();
    table.string('lang', 4).defaultTo('uz');
    table.string('phone').nullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('first_name', 15).notNullable();
    table.string('last_name', 15).notNullable();
    table.string('token').nullable();
    table.date('birthday').nullable();
    table
      .enum('status', ['active', 'passive', 'pending', 'block', 'deleted'])
      .defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
