#!/usr/bin/env python
""" This file contains all the REST API routes and the server initialization.
"""
from os import urandom
from datetime import datetime
from socket import gethostname
from flask import Flask, session, request, make_response, jsonify
from flask_mail import Mail, Message
from smtplib import SMTPException
from sqlalchemy import and_
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
# Our defined modules.
from base import base, engine
from models import DT_FORMAT
from models import User, Trip, Event, Bookmark
from models import Permissions, PermissionsEnum, Transportation, TransportEnum


# Versioning.
def make_version_path(version):
    return '/v' + str(version)


VERSION = 1
VER_PATH = make_version_path(VERSION)

# Server email.
PLANIT_EMAIL = 'planit410@gmail.com'

# App initialization.
app = Flask(__name__)
# Secret key for signing sessions.
app.secret_key = urandom(12)
# Mail instance.
app.config.update(
    # Email settings.
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_DEFAULT_SENDER=PLANIT_EMAIL,
    MAIL_USERNAME=PLANIT_EMAIL,
    MAIL_PASSWORD='410software'
)
mail = Mail(app)

# HTTP call methods.
POST = 'POST'
GET = 'GET'
PUT = 'PUT'
DELETE = 'DELETE'

# Session key variables.
KEY__LOGGED_IN = 'logged_in'
KEY__USERNAME = 'user_name'


class ResponseError(Exception):
    pass


# Generic responses. Function instead of a var because requires app context.
def bad_request(msg=None):
    if msg:
        return make_response('Bad request; %s' % msg, 400)
    else:
        return make_response('Bad request.', 400)


def get_request_json(req):
    """Returns the JSON object from the request.
    Throws a ResponseError if no JSON is found for the given request.
    """
    req_json = req.get_json(silent=True)
    if req_json is None:
        raise ResponseError('Expected to find JSON in request but not found.')
    else:
        return req_json


def create_db_session():
    """Return a new SQLAlchemy database session."""
    database_session = scoped_session(sessionmaker(bind=engine))
    """:type: sqlalchemy.orm.Session"""
    return database_session


def commit_and_close(cur_session):
    """Commit and close the given scoped session."""
    cur_session.commit()
    cur_session.close()


def to_datetime(datetime_string):
    """Convert a string to DateTime according to DT_FORMAT formatting."""
    try:
        return datetime.strptime(datetime_string, DT_FORMAT)
    except ValueError as ve:
        raise ve


def notify_user(user_name, user_email):
    """Notify the user of changed password.
    @throws SMTPException
    """
    subject = 'Planit password changed!'
    body = 'Hi %s!' % user_name
    body += '\n\n'
    body += 'Your account password was recently changed. '
    body += 'Just wanted to let you know!'
    msg = Message(subject=subject,
                  body=body,
                  recipients=[user_email])
    mail.send(msg)
    return msg.as_string()


def print_database():
    """Print out the entire database."""
    print('VVVVVVVVVVVVV', end='')
    print(view_database().replace('<br/>', '\n'))
    print('^^^^^^^^^^^^^')


def get_max_id(db, ID_attribute):
    max_id = db.query(func.max(ID_attribute).label('max')).first().max
    if max_id is None:
        max_id = 0  # No entries created yet.
    return max_id


@app.route(VER_PATH + '/users', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/users/<string:userName>', methods=[PUT, DELETE])
def users(userName=None):
    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_userName = str(req_json[User.KEY__USERNAME])
            post_password = str(req_json[User.KEY__PASSWORD])
            post_name = str(req_json[User.KEY__NAME])
            post_email = str(req_json[User.KEY__EMAIL])
            post_homeCurrency = str(req_json[User.KEY__CURRENCY])
        except (ResponseError, KeyError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            user = User(post_userName, post_password, post_name,
                        post_email, post_homeCurrency)
            db.add(user)
            db.commit()
            return make_response(jsonify({'user': user.to_dict()}), 201)
        except IntegrityError:
            db.rollback()
            return make_response('Conflict - Username taken.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        curr_userName = session.get(KEY__USERNAME)
        if curr_userName is None:
            return bad_request()
        get_userName = request.args.get(User.KEY__USERNAME, None)
        if get_userName is not None:
            db = create_db_session()
            try:
                user = db.query(User).filter(
                    User.userName == get_userName).first()
                if user is None:
                    return make_response('User not found.', 404)
                if get_userName == curr_userName:
                    return make_response(jsonify({'user': user.to_dict()}), 200)
                else:
                    ret_dict = {User.KEY__USERNAME: user.userName,
                                User.KEY__NAME: user.name}
                    return make_response(jsonify({'user': ret_dict}), 200)
            finally:
                commit_and_close(db)
        else:
            db = create_db_session()
            user = db.query(User).filter(User.userName == curr_userName).first()
            if not user:
                commit_and_close(db)
                return make_response('User not found.', 404)
            ret_dict = {'user': user.to_dict()}
            commit_and_close(db)
            return make_response(jsonify(ret_dict), 200)
    elif userName:
        curr_userName = session.get(KEY__USERNAME)
        if curr_userName is None:
            return make_response('User not logged in', 401)
        if request.method == PUT:
            if userName != curr_userName:
                return make_response('User not authorized to edit account.',
                                     401)
            db = create_db_session()
            query = db.query(User).filter(User.userName == userName).first()
            if not query:
                commit_and_close(db)
                return make_response('User not found.', 404)

            try:
                req_json = get_request_json(request)
            except ResponseError as err:
                db.close()
                return bad_request(err)

            try:
                # Optional password parameter.
                query.password = str(req_json[User.KEY__PASSWORD])
                try:
                    notify_user(userName, query.email)
                except SMTPException as se:
                    db.close()
                    return bad_request(se)
            except KeyError:
                pass

            try:
                # Optional name parameter.
                query.name = str(req_json[User.KEY__NAME])
            except KeyError:
                pass

            try:
                # Optional email parameter.
                query.email = str(req_json[User.KEY__EMAIL])
            except KeyError:
                pass

            try:
                # Optional homeCurrency parameter.
                query.homeCurrency = str(req_json[User.KEY__CURRENCY])
            except KeyError:
                pass

            ret_dict = {'user': query.to_dict()}
            commit_and_close(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                return make_response('User not authorized to delete account.',
                                     401)
            db = create_db_session()
            query = db.query(User).filter(User.userName == userName).first()
            if not query:
                commit_and_close(db)
                return make_response('User not found.', 404)
            db.delete(query)
            commit_and_close(db)
            return make_response('User deleted successfully', 200)


@app.route(VER_PATH + '/trips', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/trips/<int:tripID>', methods=[PUT, DELETE])
def trips(tripID=None):
    curr_userName = session.get(KEY__USERNAME)
    if curr_userName is None:
        return make_response('A User session is required to view Trips.', 401)

    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_tripName = str(req_json[Trip.KEY__TRIPNAME])
            post_active = str(req_json[Trip.KEY__ACTIVE])
            post_startDate = to_datetime(str(req_json[Trip.KEY__STARTDATE]))
            post_endDate = to_datetime(str(req_json[Trip.KEY__ENDDATE]))
        except (KeyError, ValueError, ResponseError) as err:
            return bad_request(err)

        db = create_db_session()
        max_id = get_max_id(db, Trip.tripID)
        trip = Trip(max_id + 1, post_tripName, post_active,
                    post_startDate, post_endDate, curr_userName)

        try:
            db.add(trip)
            db.commit()
            return make_response(jsonify({'trip': trip.to_dict()}), 201)
        except IntegrityError:
            db.rollback()
            # This should not occur given that we auto increment max EventID.
            # This might occur if multiple users are adding at the same time.
            return make_response('Conflict - TripID taken.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        post_tripID = request.args.get(Trip.KEY__ID, None)

        db = create_db_session()
        try:
            if post_tripID:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                if trip.userName != curr_userName:
                    return make_response(
                        'User not authorized to view this Trip.', 401)
                return make_response(jsonify({'trip': [trip.to_dict()]}), 200)
            else:
                trip_list = db.query(Trip).filter(
                    Trip.userName == curr_userName).all()
                if len(trip_list) == 0:
                    return make_response('No Trips found.', 404)
                trips_dict = {'trips': [trip.to_dict() for trip in trip_list]}
                return make_response(jsonify(trips_dict), 200)
        finally:
            commit_and_close(db)
    elif tripID:
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == tripID).first()
        if trip is None:
            commit_and_close(db)
            return make_response('Trip not found.', 404)
        userName = trip.userName

        if request.method == PUT:
            if userName != curr_userName:
                commit_and_close(db)
                return make_response('User not authorized to edit Trip.', 401)

            try:
                req_json = get_request_json(request)
            except ResponseError as err:
                db.close()
                return bad_request(err)

            try:
                # Optional tripName parameter.
                trip.tripName = str(req_json[Trip.KEY__TRIPNAME])
            except KeyError:
                pass

            try:
                # Optional active parameter.
                trip.active = req_json[Trip.KEY__ACTIVE]
            except KeyError:
                pass

            try:
                # Optional name startDate.
                trip.startDate = to_datetime(str(req_json[Trip.KEY__STARTDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional endDate parameter.
                trip.endDate = to_datetime(str(req_json[Trip.KEY__ENDDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            ret_dict = {'trip': trip.to_dict()}
            commit_and_close(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                commit_and_close(db)
                return make_response('User not authorized to delete Trip.', 401)
            db.delete(trip)
            commit_and_close(db)
            return make_response('Event deleted successfully', 200)


@app.route(VER_PATH + '/transportation',
           methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/transportation/<int:transportationID>',
           methods=[PUT, DELETE])
def transportation(transportationID=None):
    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_tripID = int(req_json[Trip.KEY__ID])
            post_transports = req_json['transportation']
        except (ResponseError, KeyError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response(
                    'User not authorized to add transportation this Trip.', 401)
        finally:
            commit_and_close(db)

        if not isinstance(post_transports, list) or len(post_transports) == 0:
            # There should be at least one Transportation to work with.
            return bad_request('Require at least one Transportation.')

        db = create_db_session()
        try:
            max_event_id = get_max_id(db, Event.eventID)
            max_transport_id = get_max_id(db, Transportation.transportationID)
            event_list = []
            transport_list = []
            pair_list = []
            for transport in post_transports:
                max_event_id += 1
                max_transport_id += 1
                new_event = Event(
                    max_event_id,
                    'Transportation: ' + transport[Transportation.KEY__TYPE],
                    to_datetime(transport[Transportation.KEY__DEPARTUREDATE]),
                    to_datetime(transport[Transportation.KEY__ARRIVALDATE]),
                    None, None, None, None,
                    transport.get(Transportation.KEY__DEPARTUREADDR),
                    None, post_tripID)
                new_transport = Transportation(
                    max_transport_id,
                    TransportEnum(transport[Transportation.KEY__TYPE]),
                    transport.get(Transportation.KEY__OPERATOR),
                    transport.get(Transportation.KEY__NUMBER),
                    transport.get(Transportation.KEY__DEPARTUREADDR),
                    transport.get(Transportation.KEY__ARRIVALADDR),
                    max_event_id)
                event_list.append(new_event)
                transport_list.append(new_transport)
                pair_list.append((new_event, new_transport))
        except (KeyError, ValueError) as err:
            commit_and_close(db)
            return bad_request(err)

        try:
            db.add_all(event_list + transport_list)
            db.commit()

            transport_dict_list = []
            for (e, t) in pair_list:
                t_dict = t.to_dict()
                e_dict = e.to_dict()
                t_dict[Transportation.KEY__DEPARTUREDATE] = e_dict[
                    Event.KEY__STARTDATE]
                t_dict[Transportation.KEY__ARRIVALDATE] = e_dict[
                    Event.KEY__ENDDATE]
                transport_dict_list += [t_dict]
            ret_dict = {'transportation': transport_dict_list}
            return make_response(jsonify(ret_dict), 201)
        except IntegrityError:
            db.rollback()
            # This should not occur given that we auto increment max EventID.
            # This might occur if multiple users are adding at the same time.
            return make_response(
                'Conflict - TransportationID/EventID taken.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        post_tripID = request.args.get(Trip.KEY__ID, None)
        if post_tripID is not None:
            db = create_db_session()
            try:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                if trip.userName != session.get(KEY__USERNAME):
                    return make_response(
                        'User not authorized to view these Transportations.',
                        401)
                pair_list = db.query(Event, Transportation).filter(and_(
                    Event.tripID == post_tripID,
                    Event.eventID == Transportation.eventID)).all()

                # Get shared events through permissions.
                perm_event_list = db.query(Permissions, Event).join(
                    Event.transportation).filter(
                    and_(Permissions.toTrip == post_tripID,
                         Permissions.type == PermissionsEnum.EVENT,
                         Permissions.permissionID == Event.eventID,
                         Permissions.toUser == session.get(
                             KEY__USERNAME))).all()
                eventID_list = [e.eventID for (p, e) in perm_event_list]
                pair_list += db.query(Event, Transportation).filter(and_(
                    Transportation.eventID in eventID_list,
                    Event.eventID in eventID_list,
                    Transportation.eventID == Event.eventID)).all()

                transport_dict_list = []
                for (e, t) in pair_list:
                    t_event = t.to_dict()
                    e_dict = e.to_dict()
                    t_event[Transportation.KEY__DEPARTUREDATE] = e_dict[
                        Event.KEY__STARTDATE]
                    t_event[Transportation.KEY__ARRIVALDATE] = e_dict[
                        Event.KEY__ENDDATE]
                    transport_dict_list += [t_event]

                if len(transport_dict_list) == 0:
                    return make_response(
                        'No Transportations found for the given Trip.', 404)
                return make_response(
                    jsonify({'transportations': transport_dict_list}), 200)
            finally:
                commit_and_close(db)

        post_transportID = request.args.get(Transportation.KEY__ID, None)
        if post_transportID is not None:
            db = create_db_session()
            try:
                transport = db.query(Transportation).filter(
                    Transportation.transportationID == post_transportID).first()
                if transport is None:
                    return make_response('Transportation not found.', 404)
                event = db.query(Event).filter(
                    Event.eventID == transport.eventID).first()
                if event is None:
                    return make_response(
                        'Event associated to given Transportation not found.',
                        404)
                trip = db.query(Trip).filter(
                    Trip.tripID == event.tripID).first()
                if trip is None:
                    return make_response(
                        'Trip associated to given Transportation not found.',
                        404)
                if trip.userName != session.get(KEY__USERNAME):
                    # Check if the user has shared permission instead.
                    perm = db.query(Permissions).filter(and_(
                        Permissions.permissionID == event.eventID,
                        Permissions.type == PermissionsEnum.EVENT,
                        Permissions.toUser == session.get(
                            KEY__USERNAME))).first()
                    if perm is None:
                        return make_response(
                            'User not authorized to view this Transportation.',
                            401)
                ret_dict = transport.to_dict()
                event = event.to_dict()
                ret_dict[Transportation.KEY__DEPARTUREDATE] = event[
                    Event.KEY__STARTDATE]
                ret_dict[Transportation.KEY__ARRIVALDATE] = event[
                    Event.KEY__ENDDATE]
                return make_response(jsonify({'transportation': ret_dict}), 200)
            finally:
                commit_and_close(db)

        return bad_request()
    elif transportationID:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        transport = db.query(Transportation).filter(
            Transportation.transportationID == transportationID).first()
        if transport is None:
            db.close()
            return make_response('Transportation not found.', 404)
        event = db.query(Event).filter(
            Event.eventID == transport.eventID).first()
        if event is None:
            db.close()
            return make_response(
                'Event associated to given Transportation not found.', 404)
        trip = db.query(Trip).filter(Trip.tripID == event.tripID).first()
        if trip is None:
            db.close()
            return make_response(
                'Trip for given Transportation not found.', 404)
        userName = trip.userName

        if request.method == PUT:
            if userName != curr_userName:
                # Check to see if user has write permissions.
                perm = db.query(Permissions).filter(and_(
                    Permissions.permissionID == event.eventID,
                    Permissions.type == PermissionsEnum.EVENT,
                    Permissions.toUser == curr_userName)).first()
                if perm is None or not perm.writeFlag:
                    commit_and_close(db)
                    return make_response(
                        'User not authorized to edit Transportation.', 401)

            try:
                req_json = get_request_json(request)
            except ResponseError as err:
                db.close()
                return bad_request(err)

            try:
                # Optional type parameter.
                transport.type = TransportEnum(
                    str(req_json[Transportation.KEY__TYPE]))
            except ValueError as ve:
                # Does not match a TransportEnum enum.
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional operator parameter.
                transport.operator = str(req_json[Transportation.KEY__OPERATOR])
            except KeyError:
                pass

            try:
                # Optional number parameter.
                transport.number = str(req_json[Transportation.KEY__NUMBER])
            except KeyError:
                pass

            try:
                # Optional name departureDateTime.
                event.startDateTime = to_datetime(
                    str(req_json[Transportation.KEY__DEPARTUREDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional arrivalDateTime parameter.
                event.endDateTime = to_datetime(
                    str(req_json[Transportation.KEY__ARRIVALDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional departureAddress parameter.
                transport.departureAddress = str(
                    req_json[Transportation.KEY__DEPARTUREADDR])
            except KeyError:
                pass

            try:
                # Optional arrivalAddress parameter.
                transport.arrivalAddress = str(
                    req_json[Transportation.KEY__ARRIVALADDR])
            except KeyError:
                pass

            ret_dict = transport.to_dict()
            event = event.to_dict()
            ret_dict[Transportation.KEY__DEPARTUREDATE] = event[
                Event.KEY__STARTDATE]
            ret_dict[Transportation.KEY__ARRIVALDATE] = event[
                Event.KEY__ENDDATE]
            commit_and_close(db)
            return make_response(jsonify({'transportation': ret_dict}), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                # Check to see if a permission should be deleted instead.
                perm = db.query(Permissions).filter(and_(
                    Permissions.permissionID == event.eventID,
                    Permissions.type == PermissionsEnum.EVENT,
                    Permissions.toUser == curr_userName)).first()
                if perm is not None:
                    db.delete(perm)
                    commit_and_close(db)
                    return make_response(
                        'Shared Transportation Event Permission ' +
                        'deleted successfully', 200)

                commit_and_close(db)
                return make_response(
                    'User not authorized to delete Transportation.', 401)
            db.delete(event)
            # Delete corresponding shared permissions.
            db.query(Permissions).filter(and_(
                Permissions.permissionID == event.eventID,
                Permissions.type == PermissionsEnum.EVENT)).delete()
            commit_and_close(db)
            return make_response(
                'Transportation Event deleted successfully', 200)


@app.route(VER_PATH + '/events', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/events/<int:eventID>', methods=[PUT, DELETE])
def events(eventID=None):
    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_tripID = int(req_json[Event.KEY__TRIPID])
            post_events = req_json['events']
        except (ResponseError, KeyError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response('User not authorized to add to this Trip.',
                                     401)
        finally:
            commit_and_close(db)

        if not isinstance(post_events, list) or len(post_events) == 0:
            # There should be at least one Event to work with.
            return bad_request()

        db = create_db_session()
        try:
            max_id = get_max_id(db, Event.eventID)
            event_list = []
            for event in post_events:
                max_id += 1
                event_list.append(
                    Event(max_id,
                          event[Event.KEY__EVENTNAME],
                          to_datetime(event[Event.KEY__STARTDATE]),
                          to_datetime(event[Event.KEY__ENDDATE]),
                          event.get(Event.KEY__LAT),
                          event.get(Event.KEY__LON),
                          None,
                          None,
                          event.get(Event.KEY__ADDR),
                          False,
                          post_tripID))
        except (KeyError, ValueError) as err:
            commit_and_close(db)
            return bad_request(err)

        try:
            db.add_all(event_list)
            db.commit()
            events_dict = {'event': [event.to_dict() for event in event_list]}
            return make_response(jsonify(events_dict), 201)
        except IntegrityError:
            db.rollback()
            # This should not occur given that we auto increment max EventID.
            # This might occur if multiple users are adding at the same time.
            return make_response('Conflict - EventID taken.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        post_tripID = request.args.get(Event.KEY__TRIPID, None)
        if post_tripID is not None:
            db = create_db_session()
            try:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                if trip.userName != session.get(KEY__USERNAME):
                    return make_response(
                        'User not authorized to view these Events.', 401)
                event_list = db.query(Event).filter(
                    Event.tripID == post_tripID).all()

                # Get shared events through permissions.
                perms = db.query(Permissions).filter(and_(
                    Permissions.toTrip == post_tripID,
                    Permissions.type == PermissionsEnum.EVENT,
                    Permissions.toUser == session.get(KEY__USERNAME))).all()
                shared_events = [db.query(Event).filter(
                    Event.eventID == p.permissionID).first() for p in perms]
                event_list += shared_events

                # Functional decision to omit Transportation events.
                transports = db.query(Transportation).all()
                transports = [t.eventID for t in transports]
                event_list = list(
                    filter(lambda a: a.eventID not in transports,
                           event_list))

                if len(event_list) == 0:
                    return make_response('No Events found for the given Trip.',
                                         404)
                events_dict = {
                    'events': [event.to_dict() for event in event_list]}
                return make_response(jsonify(events_dict), 200)
            finally:
                commit_and_close(db)

        post_eventID = request.args.get(Event.KEY__ID, None)
        if post_eventID is not None:
            db = create_db_session()
            try:
                event = db.query(Event).filter(
                    Event.eventID == post_eventID).first()
                if event is None:
                    return make_response('Event not found.', 404)
                trip = db.query(Trip).filter(
                    Trip.tripID == event.tripID).first()
                if trip is None:
                    return make_response(
                        'Trip associated to given Event not found.', 404)
                if trip.userName != session.get(KEY__USERNAME):
                    # Check if the user has shared permission instead.
                    perm = db.query(Permissions).filter(and_(
                        Permissions.permissionID == post_eventID,
                        Permissions.type == PermissionsEnum.EVENT,
                        Permissions.toUser == session.get(
                            KEY__USERNAME))).first()
                    if perm is None:
                        return make_response(
                            'User not authorized to view this Event.', 401)
                return make_response(jsonify({'event': event.to_dict()}), 200)
            finally:
                commit_and_close(db)

        return bad_request()
    elif eventID:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        event = db.query(Event).filter(Event.eventID == eventID).first()
        if event is None:
            commit_and_close(db)
            return make_response('Event not found.', 404)
        trip = db.query(Trip).filter(Trip.tripID == event.tripID).first()
        if trip is None:
            commit_and_close(db)
            return make_response('Trip for given Event not found.', 404)
        userName = trip.userName

        if request.method == PUT:
            if userName != curr_userName:
                # Check to see if user has write permissions.
                perm = db.query(Permissions).filter(and_(
                    Permissions.permissionID == eventID,
                    Permissions.type == PermissionsEnum.EVENT,
                    Permissions.toUser == curr_userName)).first()
                if perm is None or not perm.writeFlag:
                    commit_and_close(db)
                    return make_response('User not authorized to edit Event.',
                                         401)

            try:
                req_json = get_request_json(request)
            except ResponseError as err:
                db.close()
                return bad_request(err)

            try:
                # Optional eventName parameter.
                event.eventName = str(req_json[Event.KEY__EVENTNAME])
            except KeyError:
                pass

            try:
                # Optional name startDateTime.
                event.startDateTime = to_datetime(
                    str(req_json[Event.KEY__STARTDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional endDateTime parameter.
                event.endDateTime = to_datetime(
                    str(req_json[Event.KEY__ENDDATE]))
            except ValueError as ve:
                db.close()
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional lat parameter.
                event.lat = req_json[Event.KEY__LAT]
            except KeyError:
                pass

            try:
                # Optional lon parameter.
                event.lon = req_json[Event.KEY__LON]
            except KeyError:
                pass

            try:
                # Optional address parameter.
                event.address = str(req_json[Event.KEY__ADDR])
            except KeyError:
                pass

            ret_dict = {'event': event.to_dict()}
            commit_and_close(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                # Check to see if a permission should be deleted instead.
                perm = db.query(Permissions).filter(and_(
                    Permissions.permissionID == eventID,
                    Permissions.type == PermissionsEnum.EVENT,
                    Permissions.toUser == curr_userName)).first()
                if perm is not None:
                    db.delete(perm)
                    commit_and_close(db)
                    return make_response(
                        'Shared Event Permission deleted successfully', 200)

                commit_and_close(db)
                return make_response('User not authorized to delete Event.',
                                     401)
            db.delete(event)
            # Delete corresponding shared permissions.
            db.query(Permissions).filter(and_(
                Permissions.permissionID == eventID,
                Permissions.type == PermissionsEnum.EVENT)).delete()
            commit_and_close(db)
            return make_response('Event deleted successfully', 200)


@app.route(VER_PATH + '/bookmarks', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/bookmarks/<int:bookmarkID>', methods=[PUT, DELETE])
def bookmarks(bookmarkID=None):
    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_tripID = int(req_json[Bookmark.KEY__TRIPID])
            post_bookmarks = req_json['bookmarks']
        except (ResponseError, KeyError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response(
                    'User not authorized to add Bookmark to this Trip.', 401)
        finally:
            commit_and_close(db)

        if not isinstance(post_bookmarks, list) or len(post_bookmarks) == 0:
            # There should be at least one Bookmark to work with.
            return bad_request()

        db = create_db_session()
        try:
            max_id = get_max_id(db, Bookmark.bookmarkID)
            bookmark_list = []
            for bookmark in post_bookmarks:
                max_id += 1
                bookmark_list.append(
                    Bookmark(max_id,
                             bookmark[Bookmark.KEY__LAT],
                             bookmark[Bookmark.KEY__LON],
                             bookmark[Bookmark.KEY__PLACEID],
                             bookmark[Bookmark.KEY__NAME],
                             bookmark.get(Bookmark.KEY__ADDR),
                             bookmark.get(Bookmark.KEY__TYPE),
                             False,
                             post_tripID,
                             bookmark.get(Bookmark.KEY__EVENTID)))
        except KeyError as ke:
            commit_and_close(db)
            return bad_request(ke)

        try:
            db.add_all(bookmark_list)
            db.commit()
            bookmarks_dict = {
                'bookmarks': [bookmark.to_dict() for bookmark in bookmark_list]}
            return make_response(jsonify(bookmarks_dict), 201)
        except IntegrityError:
            db.rollback()
            # This should not occur given that we auto increment max EventID.
            # This might occur if multiple users are adding at the same time.
            return make_response('Conflict - BookmarkID taken.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        post_tripID = request.args.get(Bookmark.KEY__TRIPID, None)
        if post_tripID is not None:
            db = create_db_session()
            try:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                bookmark_list = db.query(Bookmark).filter(
                    Bookmark.tripID == post_tripID).all()

                # Get shared bookmarks through permissions.
                perms = db.query(Permissions).filter(and_(
                    Permissions.toTrip == post_tripID,
                    Permissions.type == PermissionsEnum.BOOKMARK,
                    Permissions.toUser == session.get(KEY__USERNAME))).all()
                shared_bookmarks = [db.query(Bookmark).filter(
                    Bookmark.bookmarkID == p.permissionID).first() for p in
                                    perms]
                bookmark_list += shared_bookmarks

                if len(bookmark_list) == 0:
                    return make_response(
                        'No Bookmarks found for the given Trip.', 404)
                if trip.userName != session.get(KEY__USERNAME):
                    return make_response(
                        'User not authorized to view these Bookmarks.', 401)
                bookmarks_dict = {
                    'bookmarks': [bm.to_dict() for bm in bookmark_list]}
                return make_response(jsonify(bookmarks_dict), 200)
            finally:
                commit_and_close(db)

        post_bookmarkID = request.args.get(Bookmark.KEY__ID, None)
        if post_bookmarkID is not None:
            db = create_db_session()
            try:
                bookmark = db.query(Bookmark).filter(
                    Bookmark.bookmarkID == post_bookmarkID).first()
                if bookmark is None:
                    return make_response('Bookmark not found.', 404)
                trip = db.query(Trip).filter(
                    Trip.tripID == bookmark.tripID).first()
                if trip is None:
                    return make_response(
                        'Trip associated to given Bookmark not found.', 404)
                if trip.userName != session.get(KEY__USERNAME):
                    # Check if the user has shared permission instead.
                    perm = db.query(Permissions).filter(and_(
                        Permissions.permissionID == post_bookmarkID,
                        Permissions.type == PermissionsEnum.BOOKMARK,
                        Permissions.toUser == session.get(
                            KEY__USERNAME))).first()
                    if perm is None:
                        return make_response(
                            'User not authorized to view this Bookmark.', 401)
                return make_response(jsonify({'bookmark': bookmark.to_dict()}),
                                     200)
            finally:
                commit_and_close(db)

        return bad_request()
    elif bookmarkID:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        bookmark = db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmarkID).first()
        if bookmark is None:
            commit_and_close(db)
            return make_response('Bookmark not found.', 404)
        trip = db.query(Trip).filter(Trip.tripID == bookmark.tripID).first()
        if trip is None:
            commit_and_close(db)
            return make_response('Trip for given Bookmark not found.', 404)
        userName = trip.userName

        if request.method == DELETE:
            if userName != curr_userName:
                # Check to see if a permission should be deleted instead.
                perm = db.query(Permissions).filter(and_(
                    Permissions.permissionID == bookmarkID,
                    Permissions.type == PermissionsEnum.BOOKMARK,
                    Permissions.toUser == curr_userName)).first()
                if perm is not None:
                    db.delete(perm)
                    commit_and_close(db)
                    return make_response(
                        'Shared Bookmark Permission deleted successfully', 200)

                commit_and_close(db)
                return make_response('User not authorized to delete Bookmark.',
                                     401)
            db.delete(bookmark)
            # Delete corresponding shared permissions.
            db.query(Permissions).filter(and_(
                Permissions.permissionID == bookmarkID,
                Permissions.type == PermissionsEnum.BOOKMARK)).delete()
            commit_and_close(db)
            return make_response('Bookmark deleted successfully', 200)
    return bad_request()


@app.route(VER_PATH + '/share', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/share/<int:permissionID>', methods=[PUT, DELETE])
def share(permissionID=None):
    if request.method == POST:
        try:
            req_json = get_request_json(request)
            post_userNames = req_json[User.KEY__USERNAME]
            post_tripID = int(req_json[Trip.KEY__ID])
            post_writeFlag = req_json[Permissions.KEY__WRITEFLAG]
            post_bookmarkID = req_json.get(Bookmark.KEY__ID, None)
            post_eventID = req_json.get(Event.KEY__ID, None)
        except (ResponseError, KeyError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response(
                    'User not authorized to share events or bookmarks.', 401)
            for u in post_userNames:
                user = db.query(User).filter(User.userName == u).first()
                if user is None:
                    return make_response('User not found.', 404)
        finally:
            commit_and_close(db)

        # Sharing a bookmark.
        if post_bookmarkID is not None:
            db = create_db_session()
            try:
                bookmark = db.query(Bookmark).filter(
                    Bookmark.bookmarkID == post_bookmarkID).first()
                if bookmark is None:
                    return make_response('Bookmark not found.', 404)
                if bookmark.tripID != post_tripID:
                    return make_response('Bookmark not found for given Trip',
                                         404)
                perms = [Permissions(post_bookmarkID, PermissionsEnum.BOOKMARK,
                                     post_writeFlag, u, None)
                         for u in post_userNames]
                db.add_all(perms)
                bookmark.shared = True
                db.commit()
                return make_response('Bookmark successfully shared.', 201)
            except IntegrityError:
                db.rollback()
                return make_response('Conflict - Bookmark already shared.', 409)
            finally:
                commit_and_close(db)

        # Sharing an event.
        if post_eventID is not None:
            db = create_db_session()
            try:
                event = db.query(Event).filter(
                    Event.eventID == post_eventID).first()
                if event is None:
                    return make_response('Event not found.', 404)
                if event.tripID != post_tripID:
                    return make_response('Event not found for given Trip', 404)
                perms = [Permissions(post_eventID, PermissionsEnum.EVENT,
                                     post_writeFlag, u, None)
                         for u in post_userNames]
                db.add_all(perms)
                event.shared = True
                db.commit()
                return make_response('Event successfully shared.', 201)
            except IntegrityError:
                db.rollback()
                return make_response('Conflict - Event already shared.', 409)
            finally:
                commit_and_close(db)

        # Sharing all bookmarks and events of a trip.
        db = create_db_session()
        try:
            perms = []
            # Add trip events to the permissions list.
            trip_events = db.query(Event).filter(
                Event.tripID == post_tripID).all()
            for userName in post_userNames:
                perms += [Permissions(e.eventID, PermissionsEnum.EVENT,
                                      post_writeFlag, userName, None)
                          for e in trip_events]
            # Add trip bookmarks to the permissions list.
            trip_bookmarks = db.query(Bookmark).filter(
                Bookmark.tripID == post_tripID).all()
            for userName in post_userNames:
                perms += [Permissions(b.bookmarkID, PermissionsEnum.BOOKMARK,
                                      post_writeFlag, userName, None)
                          for b in trip_bookmarks]

            if not perms:
                return make_response(
                    'No Events or Bookmarks found in the trip to share.', 404)
            db.add_all(perms)
            for e in trip_events:
                e.shared = True
            for b in trip_bookmarks:
                b.shared = True
            db.commit()
            return make_response(
                'Trip Events and Bookmarks successfully shared.', 201)
        except IntegrityError:
            db.rollback()
            return make_response(
                'Conflict - Some Events or Bookmarks already shared.', 409)
        finally:
            commit_and_close(db)
    elif request.method == GET:
        post_toUser = request.args.get(Permissions.KEY__TOUSER, None)
        if post_toUser is None:
            post_toUser = session.get(KEY__USERNAME)
        if post_toUser is not None:
            db = create_db_session()
            try:
                curr_userName = session.get(KEY__USERNAME)
                if post_toUser != curr_userName:
                    return make_response(
                        'User not authorized to view shared objects.', 401)
                perms = db.query(Permissions).filter(
                    Permissions.toUser == post_toUser).all()
                if not perms:
                    return make_response(
                        'No unaccepted permissions found for given user.', 404)
                ret_dict = {'events': [], 'bookmarks': []}
                for p in perms:
                    if p.type == PermissionsEnum.EVENT:
                        e = db.query(Event).filter(
                            Event.eventID == p.permissionID).first()
                        if e is None:
                            continue
                        else:
                            ret_dict['events'].append(e.to_dict())
                    elif p.type == PermissionsEnum.BOOKMARK:
                        b = db.query(Bookmark).filter(
                            Bookmark.bookmarkID == p.permissionID).first()
                        if b is None:
                            continue
                        else:
                            ret_dict['bookmarks'].append(b.to_dict())
                return make_response(jsonify(ret_dict), 200)
            finally:
                commit_and_close(db)
        return bad_request()
    elif permissionID:
        curr_userName = session.get(KEY__USERNAME)
        try:
            req_json = get_request_json(request)
            post_type = PermissionsEnum(str(req_json[Permissions.KEY__TYPE]))
        except (ResponseError, KeyError, ValueError) as err:
            return bad_request(err)

        db = create_db_session()
        perm = db.query(Permissions).filter(and_(
            Permissions.permissionID == permissionID,
            Permissions.type == post_type,
            Permissions.toUser == curr_userName)).first()
        if perm is None:
            commit_and_close(db)
            return make_response('Permission not found.', 404)

        if request.method == PUT:
            try:
                # Required toTrip parameter.
                post_toTrip = int(get_request_json(request)[
                                      Permissions.KEY__TOTRIP])
                perm.toTrip = post_toTrip
                db.commit()
                return make_response('Shared object added to trip.', 200)
            except (ResponseError, KeyError) as err:
                return bad_request(err)
            finally:
                db.close()
        elif request.method == DELETE:
            try:
                db.delete(perm)
                perms = db.query(Permissions).filter(and_(
                    Permissions.permissionID == permissionID,
                    Permissions.type == post_type)).all()
                if not perms:
                    # Set shared to false if no more permissions exist for it.
                    if post_type == PermissionsEnum.EVENT:
                        event = db.query(Event).filter(
                            Event.eventID == permissionID).first()
                        event.shared = False
                    elif post_type == PermissionsEnum.BOOKMARK:
                        bookmark = db.query(Bookmark).filter(
                            Bookmark.bookmarkID == permissionID).first()
                        bookmark.shared = False
                return make_response('Permission deleted successfully', 200)
            finally:
                commit_and_close(db)


@app.route(VER_PATH + '/login', methods=[POST], strict_slashes=False)
def login():
    """ /:{version}/login
    Route for login. On success, sets the session KEY__LOGGED_IN flag to True.
    """
    try:
        req_json = get_request_json(request)
        post_userName = str(req_json[User.KEY__USERNAME])
        post_password = str(req_json[User.KEY__PASSWORD])
    except (ResponseError, KeyError) as err:
        return bad_request(err)

    # print('Trying login for userName="%s", password="%s"' % (
    #     post_userName, post_password))
    db = create_db_session()
    result = db.query(User).filter(
        User.userName == post_userName,
        User.password == post_password).first()

    if not result:
        return make_response('Incorrect login details.', 401)

    session[KEY__LOGGED_IN] = True
    session[KEY__USERNAME] = post_userName
    return make_response('Login success.', 201)


@app.route(VER_PATH + '/logout', methods=[POST], strict_slashes=False)
def logout():
    """ /:{version}/logout
    Route for logout. Clears the session for the user.
    """
    session.clear()
    return make_response('Logout success.', 200)


@app.route(VER_PATH + '/view_database', strict_slashes=False)
def view_database():
    """ /:{version}/view_database
    Route for testing. Returns the entire database as a string.
    """
    from sqlalchemy import MetaData
    return_string = ''
    # Load all tables.
    metaData = MetaData()
    metaData.reflect(engine)
    database = create_db_session()
    for table in metaData.tables.values():
        return_string += '<br/>TABLE: ' + table.name
        for row in database.query(table).all():
            return_string += '<br/>   ' + ' | '.join(str(i) for i in row)
    database.close()
    return return_string


def setup_dummy_data():
    # Remove all entries.
    base.metadata.drop_all(bind=engine)
    # Create tables.
    base.metadata.create_all(bind=engine)

    """
    Example database operations.
    """
    # ADDING:
    db_session = create_db_session()
    user1 = User('admin', 'admin', 'Ad Min', 'admin@admin.com', 'CAD')
    user2 = User('user2', 'user2', 'Us Er2', 'admin@admin.com', 'USD')
    db_session.add_all([user1, user2])
    trip1 = Trip(1, 'admin_trip', True,
                 to_datetime('Sat, 10 Aug 2013 07:00:00 GMT'),
                 to_datetime('Sat, 17 Aug 2013 08:00:00 GMT'),
                 'admin')
    trip2 = Trip(2, 'user2_trip', True,
                 to_datetime('Sat, 10 Aug 2013 08:00:00 GMT'),
                 to_datetime('Sat, 24 Aug 2013 09:00:00 GMT'),
                 'user2')
    trip3 = Trip(3, 'admin_trip3', True,
                 to_datetime('Sat, 17 Aug 2013 04:00:00 GMT'),
                 to_datetime('Sat, 24 Aug 2013 05:00:00 GMT'),
                 'admin')
    db_session.add_all([trip1, trip2, trip3])
    event1 = Event(1, 'test',
                   to_datetime('Mon, 11 Aug 2013 15:15:15 GMT'),
                   to_datetime('Mon, 11 Aug 2013 16:16:16 GMT'),
                   None, None, True, None, None, False, 1)
    event2 = Event(2, 'testVancouver',
                   to_datetime('Tue, 12 Aug 2013 17:17:17 GMT'),
                   to_datetime('Tue, 12 Aug 2013 18:18:18 GMT'),
                   49.267132, -122.968941, True, None,
                   '6511 Sumas Dr Burnaby,BC V5B 2V1', False, 1)
    event3 = Event(3, 'testAustralia',
                   to_datetime('Tue, 12 Aug 2013 17:17:17 GMT'),
                   to_datetime('Tue, 12 Aug 2013 18:18:18 GMT'),
                   -33.870943, 151.190311, True,
                   to_datetime('Tue, 12 Aug 2013 17:00:00 GMT'),
                   'Western Distributor Pyrmont NSW 2009 Australia', False, 1)
    db_session.add_all([event1, event2, event3])
    # Example locations:
    bookmark1 = Bookmark(1, -33.866891, 151.200814,
                         '45a27fd8d56c56dc62afc9b49e1d850440d5c403',
                         'oneName', 'oneAddress', 'oneType',
                         False, 1, None)
    bookmark2 = Bookmark(2, -33.870943, 151.190311,
                         '30bee58f819b6c47bd24151802f25ecf11df8943',
                         'twoName', 'twoAddress', 'twoType',
                         False, 1, 3)
    db_session.add_all([bookmark1, bookmark2])
    p1 = Permissions(2, PermissionsEnum.EVENT, False, 'user2', None)
    p2 = Permissions(3, PermissionsEnum.EVENT, True, 'user2', 2)
    p3 = Permissions(2, PermissionsEnum.BOOKMARK, True, 'user2', 2)
    db_session.add_all([p1, p2, p3])
    e5 = Event(5, 'Transportation: bus',
               to_datetime('Mon, 11 Aug 2013 15:15:15 GMT'),
               to_datetime('Mon, 11 Aug 2013 16:16:16 GMT'),
               None, None, True, None, None, False, 1)
    t1 = Transportation(1, TransportEnum.BUS, None, None, None, None, 5)
    p4 = Permissions(5, PermissionsEnum.EVENT, True, 'user2', 2)
    db_session.add_all([e5, t1, p4])
    db_session.commit()
    print_database()
    """
    db_session = create_db_session()

    # DELETING:
    query = db_session.query(User).filter(User.userName=='admin').first()
    db_session.delete(query)
    db_session.commit()

    # UPDATING:
    query = db_session.query(User).filter(User.userName=='user2').first()
    query.userName = 'changeTEST'
    db_session.commit()

    # GET ALL:
    # This will return a list of Trip objects that satisfy active == True.
    # If None are found, this will be [].
    query = db_session.query(Trip).filter(Trip.active == True).all()

    # GET MAX/MIN:
    query = db_session.query(func.max(Trip.tripID).label('max_id'),
                             func.min(Trip.tripID).label('min_id'))
    # The following will be None if no entries are found.
    print(query.first().max_id)
    print(query.first().min_id)

    print_database()
    """

if __name__ == '__main__':
    setup_dummy_data()
    if 'liveweb' not in gethostname():
        # Local hosting.
        # Host at 'http://localhost:4000/' and allow reloading on code changes.
        app.run(debug=True, host='0.0.0.0', port=4000, use_reloader=True)
