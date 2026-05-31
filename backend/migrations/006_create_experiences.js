exports.up = (pgm) => {
  pgm.createTable('experiences', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    job_title: { type: 'varchar(160)', notNull: true },
    company_name: { type: 'varchar(160)', notNull: true },
    employment_type: { type: 'varchar(80)', default: 'Full-time' },
    location: { type: 'varchar(180)' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    currently_work: { type: 'boolean', notNull: true, default: false },
    description: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('experiences', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('experiences');
};
