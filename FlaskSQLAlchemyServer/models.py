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

# DateTime string format.
# https://docs.python.org/2/library/datetime.html#strftime-strptime-behavior
# JS <-> Python conversion http://stackoverflow.com/a/8154033/5608215
#   Mobile:
#       # Creating a Date object.
#       var dateObj = new Date( ... );
#       # When using dateObj as a parameter to a request, first convert to UTC.
#       var dateParameter = dateObj.toUTCString();
#       # When receiving a date string from a request, convert back to Date.
#       var fetchedDateObj = new Date(fetchedDateString);
#
#   Server:
#       # Receiving date parameter; convert to DateTime object.
#       datetime_obj = datetime.strptime(input, DT_FORMAT)
#       # Convert DateTime object to string for json output.
#       datetime_output = datetime_obj.strftime(DT_FORMAT)
#
#  %a: Weekday as locale’s abbreviated name. Sun, Mon, ..., Sat
#  %d: Day of the month as a zero-padded decimal number. 01, 02, ..., 31
#  %b: Month as locale’s abbreviated name. Jan, Feb, ..., Dec
#  %Y: Year with century as a decimal number. 1970, 1988, 2001, 2013
#  %H: Hour (24-hour clock) as a zero-padded decimal number. 00, 01, ..., 23
#  %M: Minute as a zero-padded decimal number. 00, 01, ..., 59
#  %S: Second as a zero-padded decimal number. 00, 01, ..., 59
#  %Z: Time zone name (empty string if the object is naive). (empty), UTC, EST, CST
DT_FORMAT = '%a, %d %b %Y %H:%M:%S %Z'


class User(base):
    __tablename__ = 'user'

    userName = Column(String(VARCHAR_LEN), primary_key=True, unique=True)
    password = Column(String(VARCHAR_LEN), nullable=False)
    name = Column(String(VARCHAR_LEN), nullable=False)
    email = Column(String(VARCHAR_LEN), nullable=False)
    homeCurrency = Column(String(VARCHAR_LEN), nullable=False)

    # Relationships:
    trips = relationship('Trip', cascade=CASCADE_OPTIONS,
                         backref='user', passive_updates=False)
    fromSharedObjects = relationship('SharedObject', cascade=CASCADE_OPTIONS,
                                     backref='user_from', passive_updates=False,
                                     foreign_keys='[SharedObject.fromUserID]')
    toSharedObjects = relationship('SharedObject', cascade=CASCADE_OPTIONS,
                                   backref='user_to', passive_updates=False,
                                   foreign_keys='[SharedObject.toUserID]')

    def __init__(self, userName, password, name, email, homeCurrency):
        self.userName = userName
        self.password = password
        self.name = name
        self.email = email
        self.homeCurrency = homeCurrency

    def to_dict(self):
        return {'userName': self.userName,
                'password': self.password,
                'name': self.name,
                'email': self.email,
                'homeCurrency': self.homeCurrency}


class Trip(base):
    __tablename__ = 'trip'

    tripID   = Column(Integer, primary_key=True, unique=True)
    tripName = Column(String(VARCHAR_LEN), nullable=False)
    active   = Column(Boolean, nullable=False)
    startDate = Column(DateTime, nullable=False)
    endDate   = Column(DateTime, nullable=False)
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
        return {'tripID': self.tripID,
                'tripName': self.tripName,
                'active': self.active,
                'startDate': self.startDate.strftime(DT_FORMAT),
                'endDate': self.endDate.strftime(DT_FORMAT),
                'userName': self.userName}


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
        return {'eventID': self.eventID,
                'type': self.type,
                'operator': self.operator,
                'number': self.number,
                'departureLocationID': self.departureLocationID,
                'arrivalLocationID': self.arrivalLocationID}


class Bookmark(base):
    __tablename__ = 'bookmark'

    bookmarkID = Column(Integer, primary_key=True, unique=True)
    lat = Column(Integer, nullable=False)
    lon = Column(Integer, nullable=False)
    placeID = Column(String, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String)
    type = Column(String)
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

    def __init__(self, bookmarkID, lat, lon, placeID,
                 name, address, type, tripID, eventID):
        self.bookmarkID = bookmarkID
        self.lat = lat
        self.lon = lon
        self.placeID = placeID
        self.name = name
        self.address = address
        self.type = type
        self.tripID = tripID
        self.eventID = eventID

    def to_dict(self):
        return {'bookmarkID': self.bookmarkID,
                'lat': self.lat,
                'lon': self.lon,
                'placeID': self.placeID,
                'name': self.name,
                'address': self.address,
                'type': self.type,
                'tripID': self.tripID,
                'eventID': self.eventID}


class Event(base):
    __tablename__ = 'event'

    eventID   = Column(Integer, primary_key=True, unique=True)
    eventName = Column(String(VARCHAR_LEN), nullable=False)
    startDateTime = Column(DateTime, nullable=False)
    endDateTime   = Column(DateTime, nullable=False)
    lat = Column(Integer)
    lon = Column(Integer)
    reminderFlag = Column(Boolean, nullable=False)
    reminderTime = Column(DateTime)
    address = Column(String(VARCHAR_LEN))
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
                 lat, lon, reminderFlag, reminderTime, address, tripID):
        self.eventID = eventID
        self.eventName = eventName
        self.startDateTime = startDateTime
        self.endDateTime = endDateTime
        self.lat = lat
        self.lon = lon
        if reminderFlag is None:
            self.reminderFlag = False
        else:
            self.reminderFlag = reminderFlag
        self.reminderTime = reminderTime
        self.address = address
        self.tripID = tripID

    def to_dict(self):
        return {'eventID': self.eventID,
                'eventName': self.eventName,
                'startDateTime': self.startDateTime.strftime(DT_FORMAT),
                'endDateTime': self.endDateTime.strftime(DT_FORMAT),
                'lat': self.lat,
                'lon': self.lon,
                'reminderFlag': self.reminderFlag,
                'reminderTime': self.reminderTime,
                'address': self.address,
                'tripID': self.tripID}


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
        return {'noteID': self.noteID,
                'noteType': self.noteType,
                'noteContext': self.noteContext}


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
        return {'noteID': self.noteID,
                'bookmarkID': self.bookmarkID}


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
        return {'noteID': self.noteID,
                'eventID': self.eventID}


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
        return {'sharedObjectID': self.sharedObjectID,
                'fromUserID': self.fromUserID,
                'toUserID': self.toUserID,
                'toTripID': self.toTripID}


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
        return {'bookmarkID': self.bookmarkID,
                'sharedObjectID': self.sharedObjectID}


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
        return {'eventID': self.eventID,
                'sharedObjectID': self.sharedObjectID}
