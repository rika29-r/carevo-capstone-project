exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO career_categories (name, description) VALUES
    ('Software Dev', 'Software engineering, application development, and programming roles'),
    ('Web Dev', 'Frontend, backend, fullstack, and web application roles'),
    ('Data & AI', 'Data analysis, machine learning, AI, and analytics roles'),
    ('Design', 'UI, UX, visual design, and product design roles'),
    ('Cloud & DevOps', 'Cloud infrastructure, deployment, server, and DevOps roles'),
    ('Business & PM', 'Business, product management, operations, and marketing roles'),
    ('Agriculture & Agritech', 'Agriculture, agronomy, farming, and agricultural technology roles')
    ON CONFLICT (name) DO NOTHING;
  `);

  pgm.sql(`
    INSERT INTO career_keywords (category_id, keyword, weight)
    SELECT cc.id, data.keyword, data.weight
    FROM career_categories cc
    JOIN (VALUES
      ('Software Dev', 'javascript', 3), ('Software Dev', 'java', 3), ('Software Dev', 'python', 3),
      ('Software Dev', 'algorithm', 2), ('Software Dev', 'software engineering', 4),
      ('Web Dev', 'html', 2), ('Web Dev', 'css', 2), ('Web Dev', 'react', 4),
      ('Web Dev', 'node.js', 4), ('Web Dev', 'express', 4), ('Web Dev', 'rest api', 4),
      ('Web Dev', 'frontend', 4), ('Web Dev', 'backend', 4), ('Web Dev', 'fullstack', 4),
      ('Data & AI', 'python', 3), ('Data & AI', 'sql', 3), ('Data & AI', 'machine learning', 5),
      ('Data & AI', 'data analysis', 5), ('Data & AI', 'pandas', 4), ('Data & AI', 'tensorflow', 4),
      ('Data & AI', 'dashboard', 2), ('Data & AI', 'visualization', 3),
      ('Design', 'figma', 5), ('Design', 'ui', 4), ('Design', 'ux', 4),
      ('Design', 'wireframe', 4), ('Design', 'prototype', 4), ('Design', 'user research', 4),
      ('Cloud & DevOps', 'aws', 5), ('Cloud & DevOps', 'docker', 5), ('Cloud & DevOps', 'deployment', 3),
      ('Cloud & DevOps', 'ci/cd', 4), ('Cloud & DevOps', 'linux', 3), ('Cloud & DevOps', 'cloud', 4),
      ('Business & PM', 'business', 3), ('Business & PM', 'marketing', 3), ('Business & PM', 'sales', 3),
      ('Business & PM', 'strategy', 3), ('Business & PM', 'product management', 5), ('Business & PM', 'market research', 4),
      ('Agriculture & Agritech', 'agriculture', 4), ('Agriculture & Agritech', 'agronomy', 5),
      ('Agriculture & Agritech', 'soil analysis', 5), ('Agriculture & Agritech', 'crop planning', 5),
      ('Agriculture & Agritech', 'irrigation', 4), ('Agriculture & Agritech', 'farm management', 4),
      ('Agriculture & Agritech', 'precision agriculture', 5)
    ) AS data(category_name, keyword, weight) ON cc.name = data.category_name
    ON CONFLICT (category_id, keyword) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.sql('DELETE FROM career_keywords');
  pgm.sql('DELETE FROM career_categories');
};
