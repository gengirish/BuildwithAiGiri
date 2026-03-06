"""create submissions and projects tables

Revision ID: aaeb3b239aa7
Revises: 
Create Date: 2026-03-06 19:25:52.423972

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY


revision: str = "aaeb3b239aa7"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "submissions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("full_name", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("role", sa.Text(), nullable=False),
        sa.Column("company", sa.Text(), nullable=True),
        sa.Column("idea_title", sa.Text(), nullable=False),
        sa.Column("idea_description", sa.Text(), nullable=False),
        sa.Column("target_audience", sa.Text(), nullable=True),
        sa.Column("business_model", sa.Text(), nullable=True),
        sa.Column("referral_source", sa.Text(), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    op.create_index("idx_submissions_status", "submissions", ["status"])
    op.create_index("idx_submissions_created", "submissions", ["created_at"], postgresql_using="btree")

    op.create_table(
        "projects",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("submission_id", UUID(as_uuid=True), sa.ForeignKey("submissions.id"), nullable=True),
        sa.Column("week_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("tech_stack", ARRAY(sa.Text()), server_default="{}"),
        sa.Column("github_url", sa.Text(), nullable=True),
        sa.Column("demo_url", sa.Text(), nullable=True),
        sa.Column("is_open_source", sa.Boolean(), server_default="true"),
        sa.Column("thumbnail_url", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    op.create_index("idx_projects_week", "projects", ["week_number"])

    # Row Level Security
    op.execute("ALTER TABLE submissions ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE projects ENABLE ROW LEVEL SECURITY")

    op.execute(
        'CREATE POLICY "Anyone can submit ideas" ON submissions FOR INSERT WITH CHECK (true)'
    )
    op.execute(
        'CREATE POLICY "Anyone can view projects" ON projects FOR SELECT USING (true)'
    )


def downgrade() -> None:
    op.execute('DROP POLICY IF EXISTS "Anyone can view projects" ON projects')
    op.execute('DROP POLICY IF EXISTS "Anyone can submit ideas" ON submissions')

    op.drop_index("idx_projects_week", table_name="projects")
    op.drop_table("projects")

    op.drop_index("idx_submissions_created", table_name="submissions")
    op.drop_index("idx_submissions_status", table_name="submissions")
    op.drop_table("submissions")
