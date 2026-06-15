/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("bde_members", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().unique();
        table.foreign("user_id").references("id").inTable("users");
        table.string("full_name", 150).notNullable();
        table.enum("position", ["president", "vice_president", "tresorier", "secretaire", "responsable_evenementiel", "responsable_communication", "membre"]).notNullable().defaultTo("membre");
        table.text("description");
        table.text("image_url");
        table.integer("display_order").notNullable().defaultTo(0);
        table.boolean("is_visible").notNullable().defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("bde_members");
};