/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex){
    return knex.schema.createTable("events", (table) => {
        table.increments("id").primary();
        table.string("title", 150).notNullable();
        table.string("slug", 180).notNullable().unique();
        table.text("description");
        table.string("place", 255).notNullable();
        table.decimal("price", 10, 2).notNullable().defaultTo(0.00);
        table.integer("max_participants");
        table.dateTime("start_datetime").notNullable();
        table.dateTime("end_datetime").notNullable();
        table.dateTime("registration_deadline");
        table.text("image_url");
        table.enum("status", ["draft", "published", "cancelled", "full"]).notNullable().defaultTo("draft");
        table.integer("created_by").unsigned().notNullable();
        table.foreign("created_by").references("id").inTable("users");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("events");
};