import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('activities', function (table) {
    table.increments('id').primary();
    table.integer('user_id').nullable().defaultTo(0).index();
    table.enum('action', ['create', 'update', 'delete']).defaultTo('create');
    table.integer('trackable_id').notNullable();
    table
      .string('trackable_name')
      .notNullable()
      .comment('bun yerda action bolgan table name yoziladi');
    table.datetime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('activities');
}
