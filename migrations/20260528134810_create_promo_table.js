/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("promos", (table) => {
      table.increments("id",50).primary();
      table.string("name").notNullable();
      table.tinyint("is_active").notNullable().defaultTo(1);
      table.date("created_at").defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("promos");
};
