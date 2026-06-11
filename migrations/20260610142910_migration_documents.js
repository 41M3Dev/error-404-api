/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("documents", (table) => {
        table.increments("id").primary();
        table.enum("type", ["invoice", "quote", "receipt", "contract"]).notNullable();
        table.string("number", 50);
        table.date("issue_date");
        table.date("due_date");
        table.decimal("price", 10, 2).notNullable().defaultTo(0.00);
        table.text("file_url").notNullable();
        table.string("sender_name", 150);
        table.string("sender_email", 150);
        table.text("sender_address");
        table.string("receiver_name", 150);
        table.string("receiver_email", 150);
        table.text("receiver_address");
        table.text("details");
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