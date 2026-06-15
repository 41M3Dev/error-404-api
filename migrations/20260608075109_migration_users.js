/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable().unique();
        table.string("last_name", 100).notNullable();
        table.string("first_name", 100).notNullable();
        table.string("email", 150).notNullable().unique();
        table.string("password_hash", 255).notNullable();
        table.date("birth_date").notNullable();
        table.enum("role", ["administration", "president", "vice_president", "tresorier", "secretaire", "membre_bde", "etudiant", "stagiaire"]).notNullable().defaultTo("etudiant");
        table.boolean("is_active").notNullable().defaultTo(true);
        table.integer("promo_id").unsigned();
        table.foreign("promo_id").references("id").inTable("promos");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};