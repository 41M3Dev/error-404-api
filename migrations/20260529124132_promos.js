/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("promos", (table) => {
        table.increments("id").primary();
        table.string("name", 50).notNullable().unique();
        table.boolean("is_active").notNullable().defaultTo(true);
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("promos");
};