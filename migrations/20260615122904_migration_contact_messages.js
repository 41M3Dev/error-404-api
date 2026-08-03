/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("contact_messages", (table) => {
        table.increments("id").primary();
        table.string("full_name", 150).notNullable();
        table.string("email", 150).notNullable();
        table.string("subject", 150);
        table.text("message").notNullable();
        table.enum("status", ["new", "read", "replied"]).notNullable().defaultTo("new");
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("contact_messages");
};