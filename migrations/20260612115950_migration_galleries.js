/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("galleries", (table) => {
        table.increments("id").primary();
        table.string("title", 150).notNullable();
        table.text("description");
        table.integer("event_id").unsigned();
        table.foreign("event_id").references("id").inTable("events").onDelete("SET NULL");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("galleries");
};