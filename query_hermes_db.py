import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

for db_name in ['state.db', 'kanban.db']:
    try:
        conn = sqlite3.connect(f'C:\\Users\\Fernanda\\AppData\\Local\\hermes\\{db_name}')
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f'\n--- {db_name} ---')
        for t in tables:
            cursor.execute(f'SELECT * FROM {t[0]}')
            rows = cursor.fetchall()
            for r in rows:
                row_str = str(r).lower()
                if 'linkedin' in row_str or 'prospect' in row_str or 'fixus' in row_str or 'discord' in row_str:
                    print(f'Table {t[0]}: {r}')
    except Exception as e:
        print(f"Error reading {db_name}: {e}")
