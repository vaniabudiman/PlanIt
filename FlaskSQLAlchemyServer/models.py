#!/usr/bin/env python
""" This file contains all the PlanIt models.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from base import base

VARCHAR_LEN = 40

class User(base):
    __tablename__ = 'user'

    userName = Column(String(VARCHAR_LEN), primary_key=True, unique=True)
    password = Column(String(VARCHAR_LEN), nullable=False)
    name = Column(String(VARCHAR_LEN), nullable=False)
    phoneNumber = Column(Integer, nullable=False)

    # Relationships:
    trips = relationship('Trip', cascade='all,delete-orphan',
                         backref='user', passive_updates=False)

    def __init__(self, userName, password, name, phoneNumber):
        self.userName = userName
        self.password = password
        self.name = name
        self.phoneNumber = phoneNumber

    def __repr__(self):
        return '<User(userName="%s", password="%s", ' + \
               'name="%s", phoneNumber="%s")>' % \
               (self.userName, self.password, self.name, self.phoneNumber)

class Trip(base):
    __tablename__ = 'trip'

    tripID = Column(Integer, primary_key=True, unique=True)
    tripName = Column(String(VARCHAR_LEN), nullable=False)
    active = Column(Boolean, nullable=False)
    startDate = Column(DateTime)
    endDate = Column(DateTime)
    userName = Column(String(VARCHAR_LEN),
                      ForeignKey('user.userName',
                                 ondelete='CASCADE',
                                 onupdate='CASCADE'),
                      nullable=False)

    def __init__(self, tripID, tripName, active, startDate, endDate, userName):
        self.tripID = tripID
        self.tripName = tripName
        self.active = active
        self.startDate = startDate
        self.endDate = endDate
        self.userName = userName

    def __repr__(self):
        return '<User(tripID="%s", tripName="%s", active="%s", ' + \
               'startDate="%s", endDate="%s", userName="%s")>' % \
               (self.tripID, self.tripName, self.active,
                self.startDate, self.endDate, self.userName)
