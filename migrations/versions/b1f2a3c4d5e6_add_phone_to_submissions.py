"""add phone column to submissions

Revision ID: b1f2a3c4d5e6
Revises: aaeb3b239aa7
Create Date: 2026-03-09 18:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1f2a3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "aaeb3b239aa7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "submissions",
        sa.Column("phone", sa.Text(), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("submissions", "phone")
