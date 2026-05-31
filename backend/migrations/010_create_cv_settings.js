exports.up = (pgm) => {
  pgm.createTable('cv_settings', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    file_name: { type: 'varchar(180)', default: 'CAREVO_CV.pdf' },
    include_personal_info: { type: 'boolean', notNull: true, default: true },
    include_experience: { type: 'boolean', notNull: true, default: true },
    include_education: { type: 'boolean', notNull: true, default: true },
    include_skills: { type: 'boolean', notNull: true, default: true },
    include_projects: { type: 'boolean', notNull: true, default: true },
    include_certifications: { type: 'boolean', notNull: true, default: true },
    include_languages: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('cv_settings', 'user_id', { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('cv_settings');
};
