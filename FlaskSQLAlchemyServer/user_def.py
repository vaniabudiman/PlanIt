#!/usr/bin/env python
from sqlalchemy import *
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

USER_DATABASE = 'sqlite:///user.db'
engine = create_engine(USER_DATABASE, echo=True)
Base = declarative_base()
 
class User(Base):
    __tablename__ = "users"
 
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
 
    def __init__(self, username, password):
        """"""
        self.username = username
        self.password = password

    def __repr__(self):
        return "<User(name='%s', fullname='%s', password='%s')>" % (self.name, self.fullname, self.password)


# create tables
Base.metadata.create_all(engine)






