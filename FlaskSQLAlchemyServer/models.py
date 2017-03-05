#!/usr/bin/env python
""" This file contains all the PlanIt models.
"""
from sqlalchemy import ForeignKey, Column
from sqlalchemy import Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from base import base
import enum

VARCHAR_LEN = 40
CASCADE = 'CASCADE'
CASCADE_OPTIONS = 'all,delete-orphan'


class User(base):
    __tablename__ = 'user'

    userName = Column(String(VARCHAR_LEN), primary_key=True, unique=True)
    password = Column(String(VARCHAR_LEN), nullable=False)
    name = Column(String(VARCHAR_LEN), nullable=False)
    phoneNumber = Column(Integer, nullable=False)

    # Relationships:
    trips = relationship('Trip', cascade=CASCADE_OPTIONS,
                         backref='user', passive_updates=False)
    fromSharedObjects = relationship('SharedObject', cascade=CASCADE_OPTIONS,
                                     backref='user_from', passive_updates=False,
                                     foreign_keys='[SharedObject.fromUserID]')
    toSharedObjects = relationship('SharedObject', cascade=CASCADE_OPTIONS,
                                   backref='user_to', passive_updates=False,
                                   foreign_keys='[SharedObject.toUserID]')

    def __init__(self, userName, password, name, phoneNumber):
        self.userName = userName
        self.password = password
        self.name = name
        self.phoneNumber = phoneNumber

    def to_dict(self):
        return {"userName": self.userName,
                "password": self.password,
                "name": self.name,
                "phoneNumber": self.phoneNumber}


class Trip(base):
    __tablename__ = 'trip'

    tripID   = Column(Integer, primary_key=True, unique=True)
    tripName = Column(String(VARCHAR_LEN), nullable=False)
    active   = Column(Boolean, nullable=False)
    startDate = Column(DateTime)
    endDate   = Column(DateTime)
    userName = Column(String(VARCHAR_LEN),
                      ForeignKey('user.userName',
                                 ondelete=CASCADE,
                                 onupdate=CASCADE),
                      nullable=False)

    # Relationships:
    bookmarks = relationship('Bookmark', cascade=CASCADE_OPTIONS,
                             backref='trip', passive_updates=False)
    events = relationship('Event', cascade=CASCADE_OPTIONS,
                          backref='trip', passive_updates=False)
    sharedObjects = relationship('SharedObject', cascade=CASCADE_OPTIONS,
                                 backref='trip', passive_updates=False)

    def __init__(self, tripID, tripName, active, startDate, endDate, userName):
        self.tripID = tripID
        self.tripName = tripName
        self.active = active
        self.startDate = startDate
        self.endDate = endDate
        self.userName = userName

    def to_dict(self):
        return {"tripID": self.tripID,
                "tripName": self.tripName,
                "active": self.active,
                "startDate": self.startDate,
                "endDate": self.endDate,
                "userName": self.userName}


class TransportEnum(enum.Enum):
    CAR    = 'car'
    BUS    = 'bus'
    TRAIN  = 'train'
    SEA    = 'sea'
    FLIGHT = 'flight'


class Transportation(base):
    __tablename__ = 'transportation'

    eventID = Column(Integer,
                     ForeignKey('event.eventID',
                                ondelete=CASCADE,
                                onupdate=CASCADE),
                     primary_key=True,
                     nullable=False)
    type     = Column(Enum(TransportEnum), nullable=False)
    operator = Column(String(VARCHAR_LEN))
    number   = Column(String(VARCHAR_LEN))
    departureLocationID = Column(Integer)
    arrivalLocationID   = Column(Integer)

    def __init__(self, eventID, transportType, operator,
                 number, depLocID, arrLocID):
        self.eventID = eventID
        self.type = transportType
        self.operator = operator
        self.number = number
        self.departureLocationID = depLocID
        self.arrivalLocationID = arrLocID

    def to_dict(self):
        return {"eventID": self.eventID,
                "type": self.type,
                "operator": self.operator,
                "number": self.number,
                "departureLocationID": self.departureLocationID,
                "arrivalLocationID": self.arrivalLocationID}


class Bookmark(base):
    __tablename__ = 'bookmark'

    bookmarkID = Column(Integer, primary_key=True, unique=True)
    locationID = Column(Integer, nullable=False)
    tripID = Column(Integer,
                    ForeignKey('trip.tripID',
                               ondelete=CASCADE,
                               onupdate=CASCADE),
                    nullable=False)
    eventID = Column(Integer,
                     ForeignKey('event.eventID',
                                ondelete=CASCADE,
                                onupdate=CASCADE))

    # Relationships:
    bookmarkNotes = relationship('BookmarkNote', cascade=CASCADE_OPTIONS,
                                 backref='bookmark', passive_updates=False)
    sharedBookmarks = relationship('SharedBookmark', cascade=CASCADE_OPTIONS,
                                   backref='bookmark', passive_updates=False)

    def __init__(self, bookmarkID, locationID, tripID, eventID):
        self.bookmarkID = bookmarkID
        self.locationID = locationID
        self.tripID = tripID
        self.eventID = eventID

    def to_dict(self):
        return {"bookmarkID": self.bookmarkID,
                "locationID": self.locationID,
                "tripID": self.tripID,
                "eventID": self.eventID}


class Event(base):
    __tablename__ = 'event'

    eventID   = Column(Integer, primary_key=True, unique=True)
    eventName = Column(String(VARCHAR_LEN), nullable=False)
    startDateTime = Column(DateTime, nullable=False)
    endDateTime   = Column(DateTime, nullable=False)
    locationID   = Column(Integer)
    reminderFlag = Column(Boolean, nullable=False)
    reminderTime = Column(DateTime)
    tripID = Column(Integer,
                    ForeignKey('trip.tripID',
                               ondelete=CASCADE,
                               onupdate=CASCADE),
                    nullable=False)

    # Relationships:
    bookmarks = relationship('Bookmark', cascade=CASCADE_OPTIONS,
                             backref='event', passive_updates=False)
    transportation = relationship('Transportation', cascade=CASCADE_OPTIONS,
                                  backref='event', passive_updates=False)
    eventNotes = relationship('EventNote', cascade=CASCADE_OPTIONS,
                              backref='event', passive_updates=False)
    sharedEvents = relationship('SharedEvent', cascade=CASCADE_OPTIONS,
                                backref='event', passive_updates=False)

    def __init__(self, eventID, eventName, startDateTime, endDateTime,
                 locationID, reminderFlag, reminderTime, tripID):
        self.eventID = eventID
        self.eventName = eventName
        self.startDateTime = startDateTime
        self.endDateTime = endDateTime
        self.locationID = locationID
        if reminderFlag is None:
            self.reminderFlag = False
        else:
            self.reminderFlag = reminderFlag
        self.reminderTime = reminderTime
        self.tripID = tripID

    def to_dict(self):
        return {"eventID": self.eventID,
                "eventName": self.eventName,
                "startDateTime": self.startDateTime,
                "endDateTime": self.endDateTime,
                "locationID": self.locationID,
                "reminderFlag": self.reminderFlag,
                "reminderTime": self.reminderTime,
                "tripID": self.tripID}


class NoteEnum(enum.Enum):
    TEXT  = 'text'
    PHOTO = 'photo'


class Note(base):
    __tablename__ = 'note'

    noteID   = Column(Integer, primary_key=True, unique=True)
    noteType = Column(Enum(NoteEnum), nullable=False)
    noteContext = Column(String, nullable=False)

    # Relationships:
    bookmarkNotes = relationship('BookmarkNote', cascade=CASCADE_OPTIONS,
                                 backref='note', passive_updates=False)
    eventNotes = relationship('EventNote', cascade=CASCADE_OPTIONS,
                              backref='note', passive_updates=False)

    def __init__(self, noteID, noteType, noteContext):
        self.noteID = noteID
        self.noteType = noteType
        self.noteContext = noteContext

    def to_dict(self):
        return {"noteID": self.noteID,
                "noteType": self.noteType,
                "noteContext": self.noteContext}


class BookmarkNote(base):
    __tablename__ = 'bookmarknote'

    noteID = Column(Integer,
                    ForeignKey('note.noteID',
                               ondelete=CASCADE,
                               onupdate=CASCADE),
                    primary_key=True,
                    nullable=False)
    bookmarkID = Column(Integer,
                        ForeignKey('bookmark.bookmarkID',
                                   ondelete=CASCADE,
                                   onupdate=CASCADE),
                        primary_key=True,
                        nullable=False)

    def __init__(self, noteID, bookmarkID):
        self.noteID = noteID
        self.bookmarkID = bookmarkID

    def to_dict(self):
        return {"noteID": self.noteID,
                "bookmarkID": self.bookmarkID}


class EventNote(base):
    __tablename__ = 'eventnote'

    noteID = Column(Integer,
                    ForeignKey('note.noteID',
                               ondelete=CASCADE,
                               onupdate=CASCADE),
                    primary_key=True,
                    nullable=False)
    eventID = Column(Integer,
                     ForeignKey('event.eventID',
                                ondelete=CASCADE,
                                onupdate=CASCADE),
                     primary_key=True,
                     nullable=False)

    def __init__(self, noteID, eventID):
        self.noteID = noteID
        self.eventID = eventID

    def to_dict(self):
        return {"noteID": self.noteID,
                "eventID": self.eventID}


class SharedObject(base):
    __tablename__ = 'sharedobject'

    sharedObjectID = Column(Integer, primary_key=True, unique=True)
    fromUserID = Column(Integer,
                        ForeignKey('user.userName',
                                   ondelete=CASCADE,
                                   onupdate=CASCADE),
                        nullable=False)
    toUserID = Column(Integer,
                      ForeignKey('user.userName',
                                 ondelete=CASCADE,
                                 onupdate=CASCADE),
                      nullable=False)
    toTripID = Column(Integer,
                      ForeignKey('trip.tripID',
                                 ondelete=CASCADE,
                                 onupdate=CASCADE))

    # Relationships:
    sharedBookmark = relationship('SharedBookmark', cascade=CASCADE_OPTIONS,
                                  backref='sharedobject', passive_updates=False)
    sharedEvent = relationship('SharedEvent', cascade=CASCADE_OPTIONS,
                               backref='sharedobject', passive_updates=False)

    def __init__(self, sharedObjectID, fromUserID, toUserID, toTripID):
        self.sharedObjectID = sharedObjectID
        self.fromUserID = fromUserID
        self.toUserID = toUserID
        self.toTripID = toTripID

    def to_dict(self):
        return {"sharedObjectID": self.sharedObjectID,
                "fromUserID": self.fromUserID,
                "toUserID": self.toUserID,
                "toTripID": self.toTripID}


class SharedBookmark(base):
    __tablename__ = 'sharedbookmark'

    bookmarkID = Column(Integer,
                        ForeignKey('bookmark.bookmarkID',
                                   ondelete=CASCADE,
                                   onupdate=CASCADE),
                        primary_key=True,
                        nullable=False)
    sharedObjectID = Column(Integer,
                            ForeignKey('sharedobject.sharedObjectID',
                                       ondelete=CASCADE,
                                       onupdate=CASCADE),
                            primary_key=True,
                            nullable=False)

    def __init__(self, bookmarkID, sharedObjectID):
        self.bookmarkID = bookmarkID
        self.sharedObjectID = sharedObjectID

    def to_dict(self):
        return {"bookmarkID": self.bookmarkID,
                "sharedObjectID": self.sharedObjectID}


class SharedEvent(base):
    __tablename__ = 'sharedevent'

    eventID = Column(Integer,
                     ForeignKey('event.eventID',
                                ondelete=CASCADE,
                                onupdate=CASCADE),
                     primary_key=True,
                     nullable=False)
    sharedObjectID = Column(Integer,
                            ForeignKey('sharedobject.sharedObjectID',
                                       ondelete=CASCADE,
                                       onupdate=CASCADE),
                            primary_key=True,
                            nullable=False)

    def __init__(self, eventID, sharedObjectID):
        self.eventID = eventID
        self.sharedObjectID = sharedObjectID

    def to_dict(self):
        return {"eventID": self.eventID,
                "sharedObjectID": self.sharedObjectID}
