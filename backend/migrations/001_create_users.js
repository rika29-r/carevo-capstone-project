exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(120)', notNull: true },
    email: { type: 'varchar(160)', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    role: { type: 'varchar(30)', notNull: true, default: 'user' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('users', 'email');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
