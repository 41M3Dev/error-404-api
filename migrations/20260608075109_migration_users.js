/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments ("id", 50).primary();
        table.string("username").notNullable().unique();
        table.string("last_name",100).notNullable();
        table.string("first_name",100).notNullable();
        table.string("email",150).notNullable().unique();
        table.string("password_hash",255).notNullable().unique();
        table.date("birth_date").notNullable();
        table.string("role",50).notNullable();
        table.boolean("is_active").notNullable().defaultTo(true);
        table.integer("promos_id").unsigned();
        table.foreign("promos_id").references("id").inTable("promos");
        table.timestamp(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
