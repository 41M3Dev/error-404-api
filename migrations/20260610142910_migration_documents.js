/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("documents", (table) => {
        table.increments("id").primary();
        table.enum("type", ["quote", "invoice"]).notNullable();
        table.string("number", 50).notNullable().unique();
        table.date("issue_date").notNullable();
        table.date("due_date");
        table.decimal("price", 10, 2).notNullable().defaultTo(0.00);
        table.text("file_url");
        table.string("sender_name", 150).notNullable();
        table.string("sender_email", 150);
        table.text("sender_address");
        table.string("receiver_name", 150).notNullable();
        table.string("receiver_email", 150);
        table.text("receiver_address");
        table.text("details");
        table.integer("created_by").unsigned();
        table.foreign("created_by").references("id").inTable("users").onDelete("SET NULL");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("documents");
};