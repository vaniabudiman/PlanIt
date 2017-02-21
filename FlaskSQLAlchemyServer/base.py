#!/usr/bin/env python
""" This file contains all the shared SQLAlchemy objects.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

DATABASE = 'sqlite:///models.db'
engine = create_engine(DATABASE, echo=False)
base = declarative_base()
