Start Docker Desktop: Open the Docker Desktop application on your Windows machine and wait for the engine to start completely (the icon in the system tray will turn green or stop animating).
Launch the Containers: In your terminal, inside the C:\Users\Atul_Rathore\chaiorlearn\laravel\ directory, run:
bash
docker-compose up -d
Run Migrations: Once the database is online, you'll need to migrate your tables into the new MySQL database (since we just switched away from SQLite). Run this in your backend/ directory:
bash
php artisan migrate:fresh --seed
Access phpMyAdmin:
Open your web browser and navigate to: http://localhost:8080
Username: root
Password: root (These are the credentials we specified in docker-compose.yml for the database GUI).
Once logged into phpMyAdmin, you will see a visual representation of your travelsarthi database on the left sidebar. You can click on it to view tables, run raw SQL queries, and insert/modify data directly without needing a CLI!