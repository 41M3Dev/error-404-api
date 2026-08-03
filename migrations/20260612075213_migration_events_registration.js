/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("event_registrations", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.integer("event_id").unsigned().notNullable();
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("event_id").references("id").inTable("events").onDelete("CASCADE");
        table.unique(["user_id", "event_id"]);
        table.enum("status", ["pending", "confirmed", "cancelled"]).notNullable().defaultTo("pending");
        table.dateTime("registered_at").notNullable().defaultTo(knex.fn.now());
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("event_registrations");
};