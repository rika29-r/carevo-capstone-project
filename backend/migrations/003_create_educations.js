exports.up = (pgm) => {
  pgm.createTable('educations', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    institution_name: { type: 'varchar(180)', notNull: true },
    degree_major: { type: 'varchar(180)', notNull: true },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    currently_study: { type: 'boolean', notNull: true, default: false },
    location: { type: 'varchar(180)' },
    gpa: { type: 'varchar(50)' },
    description: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('educations', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('educations');
};
