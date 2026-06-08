/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("bde_members", table ) => {
        table.increments("id", 50).primary();
        table.integer("user_id").unsigned().notNullable().unique();
        table.string("full_name", 150).notNullable();
        table.string("position", 100).notNullable();
        table.text("description");
        table.text("imgage_url");
        table.integer("display_order").notNullable().defaultTo(0);
        table.boolean("is_visible").notNullable().defaultTo(true);
        table.timestamp(true, true);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("bde_members");
};