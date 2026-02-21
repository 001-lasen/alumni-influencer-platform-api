--Populate user_roles table with initial roles --
INSERT INTO user_roles (uuid, roleName, description, roleType, createdBy, updatedBy, createdAt, updatedAt)
VALUES ('a0608b0a-1e79-4681-a637-30170e4a3624', 'Admin', 'Full system access, bid moderation, and event verification approval', 'ADMIN', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('a05c7bb5-cd09-40bf-bfb8-95c08b01b5f0', 'Alumnus', 'Can accept sponsorships, place blind bids for featured slots, and sync LinkedIn credentials', 'ALUMNI', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('0526defc-f059-4141-b453-aea977e6d383', 'Student', 'Can view the Alumni of the Day, explore career paths, and connect with featured alumni', 'STUDENT', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('6b6fc131-e843-4abe-9340-fe6810ccf6e2', 'Sponsor', 'Can offer funds to alumni for credential endorsement and manage certification campaigns', 'SPONSOR', 'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
