from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    full_name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    role = Column(Text, nullable=False)
    company = Column(Text, nullable=True)
    idea_title = Column(Text, nullable=False)
    idea_description = Column(Text, nullable=False)
    target_audience = Column(Text, nullable=True)
    business_model = Column(Text, nullable=True)
    referral_source = Column(Text, nullable=True)
    status = Column(
        String(20),
        nullable=False,
        server_default="pending",
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"), nullable=True)
    week_number = Column(Integer, nullable=False, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(Text), server_default="{}")
    github_url = Column(Text, nullable=True)
    demo_url = Column(Text, nullable=True)
    is_open_source = Column(Boolean, server_default="true")
    thumbnail_url = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
