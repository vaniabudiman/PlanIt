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
#  %Z: Time zone name. (empty), UTC, EST, CST
DT_FORMAT = '%a, %d %b %Y %H:%M:%S %Z'


class User(base):
    __tablename__ = 'user'

    userName = Column(String(VARCHAR_LEN), primary_key=True, unique=True)
    password = Column(String(VARCHAR_LEN), nullable=False)
    name = Column(String(VARCHAR_LEN), nullable=False)
    email = Column(String(VARCHAR_LEN), nullable=False)
    homeCurrency = Column(String(3), nullable=False)

    # Relationships:
    trips = relationship('Trip', cascade=CASCADE_OPTIONS,
                         backref='user', passive_updates=False)

    def __init__(self, userName, password, name, email, homeCurrency):
        self.userName = userName
        self.password = password
        self.name = name
        self.email = email
        self.homeCurrency = homeCurrency

    # User keys.
    KEY__USERNAME = 'userName'
    KEY__PASSWORD = 'password'
    KEY__NAME = 'name'
    KEY__EMAIL = 'email'
    KEY__CURRENCY = 'homeCurrency'

    def to_dict(self):
        return {self.KEY__USERNAME: self.userName,
                self.KEY__PASSWORD: self.password,
                self.KEY__NAME: self.name,
                self.KEY__EMAIL: self.email,
                self.KEY__CURRENCY: self.homeCurrency}


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
    permissions = relationship('Permissions', cascade=CASCADE_OPTIONS,
                               backref='trip', passive_updates=False)

    def __init__(self, tripID, tripName, active, startDate, endDate, userName):
        self.tripID = tripID
        self.tripName = tripName
        self.active = active
        self.startDate = startDate
        self.endDate = endDate
        self.userName = userName

    # Trip keys.
    KEY__ID = 'tripID'
    KEY__TRIPNAME = 'tripName'
    KEY__ACTIVE = 'active'
    KEY__STARTDATE = 'startDate'
    KEY__ENDDATE = 'endDate'
    KEY__USERNAME = 'userName'

    def to_dict(self):
        return {self.KEY__ID: self.tripID,
                self.KEY__TRIPNAME: self.tripName,
                self.KEY__ACTIVE: self.active,
                self.KEY__STARTDATE: self.startDate.strftime(DT_FORMAT),
                self.KEY__ENDDATE: self.endDate.strftime(DT_FORMAT),
                self.KEY__USERNAME: self.userName}


class TransportEnum(enum.Enum):
    CAR    = 'car'
    BUS    = 'bus'
    TRAIN  = 'train'
    SEA    = 'sea'
    FLIGHT = 'flight'


class Transportation(base):
    __tablename__ = 'transportation'

    transportationID   = Column(Integer, primary_key=True, unique=True)
    type     = Column(Enum(TransportEnum), nullable=False)
    operator = Column(String(VARCHAR_LEN))
    number   = Column(String(VARCHAR_LEN))
    departureAddress = Column(String(VARCHAR_LEN))
    arrivalAddress   = Column(String(VARCHAR_LEN))
    eventID = Column(Integer,
                     ForeignKey('event.eventID',
                                ondelete=CASCADE,
                                onupdate=CASCADE),
                     nullable=False)

    def __init__(self, transportationID, tType, operator, number,
                 departureAddress, arrivalAddress, eventID):
        self.transportationID = transportationID
        self.type = tType
        self.operator = operator
        self.number = number
        self.departureAddress = departureAddress
        self.arrivalAddress = arrivalAddress
        self.eventID = eventID

    # Trip keys.
    KEY__ID = 'transportationID'
    KEY__TYPE = 'type'
    KEY__OPERATOR = 'operator'
    KEY__NUMBER = 'number'
    KEY__DEPARTUREADDR = 'departureAddress'
    KEY__ARRIVALADDR = 'arrivalAddress'
    KEY__EVENTID = 'eventID'
    KEY__DEPARTUREDATE = 'departureDateTime'  # Refers to Event startDateTime.
    KEY__ARRIVALDATE = 'arrivalDateTime'      # Refers to Event endDateTime.

    def to_dict(self):
        return {self.KEY__ID: self.transportationID,
                self.KEY__TYPE: self.type.value,
                self.KEY__OPERATOR: self.operator,
                self.KEY__NUMBER: self.number,
                self.KEY__DEPARTUREADDR: self.departureAddress,
                self.KEY__ARRIVALADDR: self.arrivalAddress,
                self.KEY__EVENTID: self.eventID}


class Bookmark(base):
    __tablename__ = 'bookmark'

    bookmarkID = Column(Integer, primary_key=True, unique=True)
    lat = Column(Integer, nullable=False)
    lon = Column(Integer, nullable=False)
    placeID = Column(String, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String)
    type = Column(String)
    shared = Column(Boolean, nullable=False)
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
    # TODO: uncomment out when implementing.
    # bookmarkNotes = relationship('BookmarkNote', cascade=CASCADE_OPTIONS,
    #                              backref='bookmark', passive_updates=False)

    def __init__(self, bookmarkID, lat, lon, placeID,
                 name, address, bType, shared, tripID, eventID):
        self.bookmarkID = bookmarkID
        self.lat = lat
        self.lon = lon
        self.placeID = placeID
        self.name = name
        self.address = address
        self.type = bType
        if shared is None:
            self.shared = False
        else:
            self.shared = shared
        self.tripID = tripID
        self.eventID = eventID

    # Bookmark keys.
    KEY__ID = 'bookmarkID'
    KEY__LAT = 'lat'
    KEY__LON = 'lon'
    KEY__PLACEID = 'placeID'
    KEY__NAME = 'name'
    KEY__ADDR = 'address'
    KEY__TYPE = 'type'
    KEY__SHARED = 'shared'
    KEY__TRIPID = 'tripID'
    KEY__EVENTID = 'eventID'

    def to_dict(self):
        return {self.KEY__ID: self.bookmarkID,
                self.KEY__LAT: self.lat,
                self.KEY__LON: self.lon,
                self.KEY__PLACEID: self.placeID,
                self.KEY__NAME: self.name,
                self.KEY__ADDR: self.address,
                self.KEY__TYPE: self.type,
                self.KEY__SHARED: self.shared,
                self.KEY__TRIPID: self.tripID,
                self.KEY__EVENTID: self.eventID}


class Event(base):
    __tablename__ = 'event'

    eventID   = Column(Integer, primary_key=True, unique=True)
    eventName = Column(String(VARCHAR_LEN), nullable=False)
    startDateTime = Column(DateTime, nullable=False)
    endDateTime   = Column(DateTime, nullable=False)
    lat = Column(Integer)
    lon = Column(Integer)
    reminderFlag = Column(Boolean)
    reminderTime = Column(DateTime)
    address = Column(String(VARCHAR_LEN))
    shared = Column(Boolean, nullable=False)
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
    # TODO: uncomment out when implementing.
    # eventNotes = relationship('EventNote', cascade=CASCADE_OPTIONS,
    #                           backref='event', passive_updates=False)

    def __init__(self, eventID, eventName, startDateTime, endDateTime,
                 lat, lon, reminderFlag, reminderTime, address, shared, tripID):
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
        if shared is None:
            self.shared = False
        else:
            self.shared = shared
        self.tripID = tripID

    # Event keys
    KEY__ID = 'eventID'
    KEY__EVENTNAME = 'eventName'
    KEY__STARTDATE = 'startDateTime'
    KEY__ENDDATE = 'endDateTime'
    KEY__LAT = 'lat'
    KEY__LON = 'lon'
    KEY__REMFLAG = 'reminderFlag'
    KEY__REMTIME = 'reminderTime'
    KEY__ADDR = 'address'
    KEY__SHARED = 'shared'
    KEY__TRIPID = 'tripID'

    def to_dict(self):
        return {self.KEY__ID: self.eventID,
                self.KEY__EVENTNAME: self.eventName,
                self.KEY__STARTDATE: self.startDateTime.strftime(DT_FORMAT),
                self.KEY__ENDDATE: self.endDateTime.strftime(DT_FORMAT),
                self.KEY__LAT: self.lat,
                self.KEY__LON: self.lon,
                self.KEY__REMFLAG: self.reminderFlag,
                self.KEY__REMTIME: self.reminderTime,
                self.KEY__ADDR: self.address,
                self.KEY__SHARED: self.shared,
                self.KEY__TRIPID: self.tripID}


"""
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
                'noteType': self.noteType.value,
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
"""


class PermissionsEnum(enum.Enum):
    BOOKMARK = 'bookmark'
    EVENT = 'event'


class Permissions(base):
    __tablename__ = 'permissions'

    permissionID = Column(Integer, primary_key=True, nullable=False)
    type = Column(Enum(PermissionsEnum), primary_key=True, nullable=False)
    writeFlag = Column(Boolean, nullable=False)
    toUser = Column(String(VARCHAR_LEN), primary_key=True, nullable=False)
    toTrip = Column(Integer,
                    ForeignKey('trip.tripID',
                               ondelete=CASCADE,
                               onupdate=CASCADE))

    def __init__(self, permissionID, pType, writeFlag, toUser, toTrip):
        self.permissionID = permissionID
        self.type = pType
        self.writeFlag = writeFlag
        self.toUser = toUser
        self.toTrip = toTrip

    # Permissions keys.
    KEY__ID = 'permissionID'
    KEY__TYPE = 'type'
    KEY__WRITEFLAG = 'writeFlag'
    KEY__TOUSER = 'toUser'
    KEY__TOTRIP = 'toTrip'

    # def to_dict(self):
    #     return {self.KEY__ID: self.permissionID,
    #             self.KEY__TYPE: self.type.value,
    #             self.KEY__WRITEFLAG: self.writeFlag,
    #             self.KEY__TOUSER: self.toUser,
    #             self.KEY__TOTRIP: self.toTrip}
