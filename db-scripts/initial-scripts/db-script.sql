--Populate user_roles table with initial roles --
INSERT INTO user_roles (uuid, roleName, description, createdBy, updatedBy, createdAt, updatedAt)
VALUES ('a0608b0a-1e79-4681-a637-30170e4a3624', 'ADMIN', 'Full system access, bid moderation, and event verification approval',  'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('a05c7bb5-cd09-40bf-bfb8-95c08b01b5f0', 'ALUMNI', 'Can accept sponsorships, place blind bids for featured slots, and sync LinkedIn credentials',  'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('0526defc-f059-4141-b453-aea977e6d383', 'STUDENT', 'Can view the Alumni of the Day, explore career paths, and connect with featured alumni',  'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('6b6fc131-e843-4abe-9340-fe6810ccf6e2', 'SPONSOR', 'Can offer funds to alumni for credential endorsement and manage certification campaigns',  'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('2129cfdf-e56b-4cc8-a5a2-164862804bbe', 'DEVELOPER', 'Developer role for platform development',  'Lasen', 'Lasen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);;
