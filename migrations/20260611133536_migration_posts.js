/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("posts", (table) => {
        table.increments("id").primary();
        table.string("title", 150).notNullable();
        table.string("slug", 180).notNullable().unique();
        table.text("content");
        table.text("image_url");
        table.enum("status", ["brouillon", "publie"]).notNullable().defaultTo("brouillon");
        table.integer("author_id").unsigned().notNullable();
        table.foreign("author_id").references("id").inTable("users");
        table.dateTime("published_at");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("posts");
};