from alembic import context
from app.db.base_class import Base

target_metadata = Base.metadata


def run_migrations_offline():
    context.configure(url="postgresql://postgres:postgres@db:5432/nearshop")
    with context.begin_transaction():
        context.run_migrations()
