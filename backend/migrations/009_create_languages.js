exports.up = (pgm) => {
  pgm.createTable('languages', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    language: { type: 'varchar(100)', notNull: true },
    proficiency: { type: 'varchar(80)', notNull: true, default: 'Professional Working' },
    year_started: { type: 'integer' },
    usage_frequency: { type: 'varchar(50)', default: 'Daily' },
    flag_code: { type: 'varchar(10)' },
    flag_url: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('languages', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('languages');
};
