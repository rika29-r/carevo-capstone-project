exports.up = (pgm) => {
  pgm.createTable('experience_skills', {
    id: 'id',
    experience_id: { type: 'integer', notNull: true, references: 'experiences(id)', onDelete: 'CASCADE' },
    skill_id: { type: 'integer', notNull: true, references: 'skills(id)', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('experience_skills', ['experience_id', 'skill_id'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('experience_skills');
};
