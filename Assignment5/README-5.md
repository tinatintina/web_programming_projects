Student Name: Tina Srivastava 
Student Number:103297230
Student Email: tsrivastava5@myseneca.ca 
Date Created: 26.11.2024

GITHUB URL: https://github.com/tinatintina/web322_assignment/edit/main/README.md VERCEL URL: https://vercel.com/tina-srivastavas-projects/web322-assignment

Technology Stack

Frontend:
Backend: TBD
Database: TBD

Notes
In the context of this project, the integration with Neon.tech required the migration from a JSON-based data storage solution to a cloud-hosted PostgreSQL database. A new project, blog_database, was created on Neon.tech, and each of the database access credentials (host, username, password, port and database name) was sourced from the Neon.tech dashboard. These credentials were then stored securely in a `.env` file so as to safeguard them and at the same time allow the application to connect to the database without the need for hardcoded settings in the codebase. The integration supports the provision of large volume data storage, secure and centralized access to data resources.
The installation and configuration of the database drivers was carried out by adding a configuration file separately from the code base. To set the database connection credentials in this way, the `dotenv` library was added to the project and later used. The environment variables were referenced in code as process variables. A `.env` file was created in the root directory of the project that contains the database connection settings as pairs of keys and values (for example, `DB_HOST=your_neon_host`). The `content-service.js` file was modified to specify these variables from the application’s configuration file and provide them for usage in configuration for `Pool` of PostgreSQL. This configuration provides ease in handling a varying number of database connections efficiently while improving security and usability across multiple locations.




By submitting this as my assignment, I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students.
