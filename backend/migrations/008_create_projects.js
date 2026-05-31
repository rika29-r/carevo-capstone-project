exports.up = (pgm) => {
  pgm.createTable('projects', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    thumbnail: { type: 'text' },
    thumbnail_name: { type: 'varchar(255)' },
    title: { type: 'varchar(180)', notNull: true },
    status: { type: 'varchar(50)', notNull: true, default: 'In Progress' },
    role: { type: 'varchar(150)' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    description: { type: 'text' },
    demo_url: { type: 'text' },
    github_url: { type: 'text' },
    featured: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('projects', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('projects');
};
