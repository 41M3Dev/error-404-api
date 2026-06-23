/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("events_registration", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.integer("event_id").unsigned().notNullable();
        table.foreign("user_id").references("id").inTable("users");
        table.foreign("event_id").references("id").inTable("events");
        table.unique(["user_id", "event_id"]);
        table.enum("status", ["en_attente", "confirmee", "annulee"]).notNullable().defaultTo("en_attente");
        table.dateTime("registered_at").notNullable().defaultTo(knex.fn.now());
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("events_registration");
};