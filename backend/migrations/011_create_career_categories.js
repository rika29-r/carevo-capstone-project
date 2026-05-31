exports.up = (pgm) => {
  pgm.createTable('career_categories', {
    id: 'id',
    name: { type: 'varchar(120)', notNull: true, unique: true },
    description: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('career_categories');
};
