exports.up = (pgm) => {
  pgm.createTable('certifications', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    certificate_name: { type: 'varchar(180)', notNull: true },
    issuer: { type: 'varchar(180)' },
    issue_date: { type: 'date' },
    expiration_date: { type: 'date' },
    credential_id: { type: 'varchar(180)' },
    credential_url: { type: 'text' },
    description: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('certifications', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('certifications');
};
