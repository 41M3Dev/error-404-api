/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("posts", (table) => {
        table.increments("id").primary();
        table.string("title", 150).notNullable();
        table.string("slug", 180).notNullable().unique();
        table.text("content").notNullable();
        table.text("image_url");
        table.enum("status", ["draft", "published"]).notNullable().defaultTo("draft");
        table.integer("author_id").unsigned();
        table.foreign("author_id").references("id").inTable("users").onDelete("SET NULL");
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