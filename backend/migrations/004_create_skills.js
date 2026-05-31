exports.up = (pgm) => {
  pgm.createTable('skills', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    name: { type: 'varchar(120)', notNull: true },
    category: { type: 'varchar(80)' },
    level: { type: 'varchar(80)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('skills', 'user_id');
  pgm.createIndex('skills', ['user_id', 'name'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('skills');
};
