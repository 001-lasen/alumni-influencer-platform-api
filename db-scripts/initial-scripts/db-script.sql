--Populate user_roles table with initial roles --
INSERT INTO user_roles (uuid, roleName, description, createdBy, updatedBy, createdAt, updatedAt)
VALUES ('a0608b0a-1e79-4681-a637-30170e4a3624', 'admin', 'Administrator role with full permissions', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('a05c7bb5-cd09-40bf-bfb8-95c08b01b5f0', 'alumni', 'Graduates who can bid for Alumni of the Day and promote sponsorships', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('0526defc-f059-4141-b453-aea977e6d383', 'student', 'Current students who can view alumni profiles and featured influencers', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('6b6fc131-e843-4abe-9340-fe6810ccf6e2', 'sponsor', 'Organizations providing sponsorships for alumni to promote courses', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
