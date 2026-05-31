exports.up = (pgm) => {
  pgm.createTable('profile_infos', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE', unique: true },
    full_name: { type: 'varchar(150)', notNull: true },
    career_interest: { type: 'varchar(150)' },
    professional_title: { type: 'varchar(150)' },
    location: { type: 'varchar(180)' },
    short_bio: { type: 'text' },
    profile_image: { type: 'text' },
    profile_image_name: { type: 'varchar(255)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('profile_infos', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('profile_infos');
};
