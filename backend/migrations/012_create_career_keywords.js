exports.up = (pgm) => {
  pgm.createTable('career_keywords', {
    id: 'id',
    category_id: { type: 'integer', notNull: true, references: 'career_categories(id)', onDelete: 'CASCADE' },
    keyword: { type: 'varchar(140)', notNull: true },
    weight: { type: 'integer', notNull: true, default: 1 },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('career_keywords', ['category_id', 'keyword'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('career_keywords');
};
