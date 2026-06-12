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

        // CORRECTION : Un ENUM adapté au cycle de vie d'un Post
        table.enum("status", ["draft", "published", "archived"]).notNullable().defaultTo("draft");

        // CORRECTION SÉCURITÉ : Clé étrangère propre, non-signée et reliée à la table users
        table.integer("author_id").unsigned().notNullable();
        table.foreign("author_id").references("id").inTable("users");

        // Tes dates parfaitement gérées
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