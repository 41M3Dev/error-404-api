/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("gallery_images", (table) => {
        table.increments("id").primary();
        table.integer("gallery_id").unsigned().notNullable();
        table.foreign("gallery_id").references("id").inTable("galleries").onDelete("CASCADE");
        table.text("image_url").notNullable();
        table.string("alt_text", 255);
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("gallery_images");
};