#!/usr/bin/env python
""" This file contains all the REST API routes and the server initialization.
"""
from os import urandom
from datetime import datetime
from socket import gethostname
from flask import Flask, session, request, make_response, jsonify
from flask import render_template  # TODO: remove along with index()
from flask_mail import Mail, Message
from smtplib import SMTPException
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
# Our defined modules.
from base import base, engine
from models import DT_FORMAT
from models import User, Trip, Event, Bookmark

# Versioning.
VERSION = 'v1'
VER_PATH = '/' + VERSION

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


# Generic responses. Function instead of a var because requires app context.
def bad_request(msg=None):
    if msg:
        return make_response('Bad request; %s' % msg, 400)
    else:
        return make_response('Bad request.', 400)


def create_db_session():
    """Return a new SQLAlchemy database session."""
    database_session = scoped_session(sessionmaker(bind=engine))
    """:type: sqlalchemy.orm.Session"""
    return database_session


def close_session(cur_session):
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
    print('VVVVVVVVVVVVV')
    print(view_database().replace('<br/>', '\n'))
    print('^^^^^^^^^^^^^')


@app.route(VER_PATH + '/')
def index():
    """ /:{version}/
    Route for local testing. For graphical HTML view at hosted address.
    """
    if session.get(KEY__LOGGED_IN):
        return 'Logged in. <a href="' + VER_PATH + '/logout">Logout</a>'
    else:
        return render_template('login.html')


@app.route(VER_PATH + '/users', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/users/<string:userName>', methods=[PUT, DELETE])
def users(userName=None):
    if request.method == POST:
        try:
            post_userName = str(request.json['userName'])
            post_password = str(request.json['password'])
            post_name = str(request.json['name'])
            post_email = str(request.json['email'])
            post_homeCurrency = str(request.json['homeCurrency'])
        except KeyError:
            return bad_request()

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
            close_session(db)
    elif request.method == GET:
        curr_userName = session.get(KEY__USERNAME)
        get_userName = request.args.get('userName', None)
        if get_userName is not None:
            db = create_db_session()
            try:
                user = db.query(User).filter(
                    User.userName == get_userName).first()
                if get_userName == curr_userName:
                    return make_response(jsonify({'user': user.to_dict()}), 200)
                else:
                    ret_dict = {'userName': user.userName, 'name': user.name}
                    return make_response(jsonify({'user': ret_dict}), 200)
            finally:
                close_session(db)
        else:
            db = create_db_session()
            user = db.query(User).filter(User.userName == curr_userName).first()
            if not user:
                close_session(db)
                return make_response('User not found.', 404)
            ret_dict = {'user': user.to_dict()}
            close_session(db)
            return make_response(jsonify(ret_dict), 200)
    elif userName:
        curr_userName = session.get(KEY__USERNAME)
        if request.method == PUT:
            if userName != curr_userName:
                return make_response('User not authorized to edit account.',
                                     401)
            db = create_db_session()
            query = db.query(User).filter(User.userName == userName).first()
            if not query:
                close_session(db)
                return make_response('User not found.', 404)

            try:
                # Optional password parameter.
                post_password = str(request.json['password'])
                query.password = post_password
                try:
                    notify_user(userName, query.email)
                except SMTPException as se:
                    return bad_request(se)
            except KeyError:
                pass

            try:
                # Optional name parameter.
                post_name = str(request.json['name'])
                query.name = post_name
            except KeyError:
                pass

            try:
                # Optional email parameter.
                post_email = str(request.json['email'])
                query.email = post_email
            except KeyError:
                pass

            try:
                # Optional homeCurrency parameter.
                post_homeCurrency = str(request.json['homeCurrency'])
                query.homeCurrency = post_homeCurrency
            except KeyError:
                pass

            ret_dict = {'user': query.to_dict()}
            close_session(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                return make_response('User not authorized to delete account.',
                                     401)
            db = create_db_session()
            query = db.query(User).filter(User.userName == userName).first()
            if not query:
                close_session(db)
                return make_response('User not found.', 404)
            db.delete(query)
            close_session(db)
            return make_response('User deleted successfully', 200)
    return bad_request()


@app.route(VER_PATH + '/trips', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/trips/<int:tripID>', methods=[PUT, DELETE])
def trips(tripID=None):
    curr_userName = session.get(KEY__USERNAME)
    if curr_userName is None:
        return make_response('A User session is required to view Trips.', 401)

    if request.method == POST:
        try:
            post_tripName = str(request.json['tripName'])
            post_active = str(request.json['active'])
            post_startDate = to_datetime(str(request.json['startDate']))
            post_endDate = to_datetime(str(request.json['endDate']))
        except (KeyError, ValueError) as err:
            return bad_request(err)

        db = create_db_session()
        try:
            max_id = db.query(
                func.max(Trip.tripID).label('max_id')).first().max_id
            if max_id is None:
                max_id = 0  # No entries created yet.
            trip = Trip(max_id + 1, post_tripName, post_active,
                        post_startDate, post_endDate, curr_userName)
        except ValueError as ve:
            close_session(db)
            return bad_request(ve)

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
            close_session(db)
    elif request.method == GET:
        post_tripID = request.args.get('tripID', None)

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
            close_session(db)
    elif tripID:
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == tripID).first()
        if trip is None:
            close_session(db)
            return make_response('Trip not found.', 404)
        userName = trip.userName

        if request.method == PUT:
            if userName != curr_userName:
                close_session(db)
                return make_response('User not authorized to edit Trip.', 401)
            try:
                # Optional tripName parameter.
                post_tripName = str(request.json['tripName'])
                trip.tripName = post_tripName
            except KeyError:
                pass

            try:
                # Optional active parameter.
                post_active = request.json['active']
                trip.active = post_active
            except KeyError:
                pass

            try:
                # Optional name startDate.
                post_startDate = str(request.json['startDate'])
                trip.startDate = to_datetime(post_startDate)
            except ValueError as ve:
                close_session(db)
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional endDate parameter.
                post_endDate = str(request.json['endDate'])
                trip.endDate = to_datetime(post_endDate)
            except ValueError as ve:
                close_session(db)
                return bad_request(ve)
            except KeyError:
                pass

            ret_dict = {'trip': trip.to_dict()}
            close_session(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                close_session(db)
                return make_response('User not authorized to delete Trip.', 401)
            db.delete(trip)
            close_session(db)
            return make_response('Event deleted successfully', 200)
    return bad_request()


@app.route(VER_PATH + '/events', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/events/<int:eventID>', methods=[PUT, DELETE])
def events(eventID=None):
    if request.method == POST:
        try:
            post_tripID = int(request.json['tripID'])
            post_events = request.json['events']
        except KeyError:
            return bad_request()

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response('User not authorized to add to this Trip.',
                                     401)
        finally:
            close_session(db)

        if len(post_events) == 0:
            # There should be at least one Event to work with.
            return bad_request()

        db = create_db_session()
        try:
            max_id = db.query(
                func.max(Event.eventID).label('max_id')).first().max_id
            if max_id is None:
                max_id = 0  # No entries created yet.
            event_list = []

            for event in post_events:
                max_id += 1
                event_list.append(Event(max_id,
                                        event['eventName'],
                                        to_datetime(event['startDateTime']),
                                        to_datetime(event['endDateTime']),
                                        event.get('lat'),
                                        event.get('lon'),
                                        None,
                                        None,
                                        post_tripID))
        except (KeyError, ValueError) as err:
            close_session(db)
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
            close_session(db)
    elif request.method == GET:
        post_tripID = request.args.get('tripID', None)
        if post_tripID is not None:
            db = create_db_session()
            try:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                event_list = db.query(Event).filter(
                    Event.tripID == post_tripID).all()
                if len(event_list) == 0:
                    return make_response('No Events found for the given Trip.',
                                         404)
                if trip.userName != session.get(KEY__USERNAME):
                    return make_response(
                        'User not authorized to view these Events.', 401)
                events_dict = {
                    'events': [event.to_dict() for event in event_list]}
                return make_response(jsonify(events_dict), 200)
            finally:
                close_session(db)

        post_eventID = request.args.get('eventID', None)
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
                    return make_response(
                        'User not authorized to view this Event.', 401)
                return make_response(jsonify({'event': event.to_dict()}), 200)
            finally:
                close_session(db)

        return bad_request()
    elif eventID:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        event = db.query(Event).filter(Event.eventID == eventID).first()
        if event is None:
            close_session(db)
            return make_response('Event not found.', 404)
        trip = db.query(Trip).filter(Trip.tripID == event.tripID).first()
        if trip is None:
            close_session(db)
            return make_response('Trip for given Event not found.', 404)
        userName = trip.userName

        if request.method == PUT:
            if userName != curr_userName:
                close_session(db)
                return make_response('User not authorized to edit Event.',
                                     401)
            try:
                # Optional eventName parameter.
                post_eventName = str(request.json['eventName'])
                event.eventName = post_eventName
            except KeyError:
                pass

            try:
                # Optional name startDateTime.
                post_startDateTime = str(request.json['startDateTime'])
                event.startDateTime = to_datetime(post_startDateTime)
            except ValueError as ve:
                close_session(db)
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional endDateTime parameter.
                post_endDateTime = str(request.json['endDateTime'])
                event.endDateTime = to_datetime(post_endDateTime)
            except ValueError as ve:
                close_session(db)
                return bad_request(ve)
            except KeyError:
                pass

            try:
                # Optional lat parameter.
                post_lat = int(request.json['lat'])
                event.lat = post_lat
            except KeyError:
                pass

            try:
                # Optional lon parameter.
                post_lon = int(request.json['lon'])
                event.lon = post_lon
            except KeyError:
                pass

            ret_dict = {'event': event.to_dict()}
            close_session(db)
            return make_response(jsonify(ret_dict), 200)
        elif request.method == DELETE:
            if userName != curr_userName:
                close_session(db)
                return make_response('User not authorized to delete Event.',
                                     401)
            db.delete(event)
            close_session(db)
            return make_response('Event deleted successfully', 200)
    return bad_request()


@app.route(VER_PATH + '/bookmarks', methods=[POST, GET], strict_slashes=False)
@app.route(VER_PATH + '/bookmarks/<int:bookmarkID>', methods=[PUT, DELETE])
def bookmarks(bookmarkID=None):
    if request.method == POST:
        try:
            post_tripID = int(request.json['tripID'])
            post_bookmarks = request.json['bookmarks']
        except KeyError:
            return bad_request()

        db = create_db_session()
        try:
            trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
            if trip is None:
                return make_response('Trip not found.', 404)
            if trip.userName != session.get(KEY__USERNAME):
                return make_response(
                    'User not authorized to add Bookmark to this Trip.', 401)
        finally:
            close_session(db)

        if len(post_bookmarks) == 0:
            # There should be at least one Bookmark to work with.
            return bad_request()

        db = create_db_session()
        try:
            max_id = db.query(
                func.max(Bookmark.bookmarkID).label('max_id')).first().max_id
            if max_id is None:
                max_id = 0  # No entries created yet.
            bookmark_list = []

            for bookmark in post_bookmarks:
                max_id += 1
                bookmark_list.append(
                    Bookmark(max_id,
                             bookmark['lat'],
                             bookmark['lon'],
                             bookmark['placeID'],
                             bookmark['name'],
                             bookmark.get('address', None),
                             bookmark.get('type', None),
                             post_tripID,
                             bookmark.get('eventID', None)))
        except KeyError as ke:
            close_session(db)
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
            close_session(db)
    elif request.method == GET:
        post_tripID = request.args.get('tripID', None)
        if post_tripID is not None:
            db = create_db_session()
            try:
                trip = db.query(Trip).filter(Trip.tripID == post_tripID).first()
                if trip is None:
                    return make_response('Trip not found.', 404)
                bookmark_list = db.query(Bookmark).filter(
                    Bookmark.tripID == post_tripID).all()
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
                close_session(db)

        post_bookmarkID = request.args.get('bookmarkID', None)
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
                    return make_response(
                        'User not authorized to view this Bookmark.', 401)
                return make_response(jsonify({'bookmark': bookmark.to_dict()}),
                                     200)
            finally:
                close_session(db)

        return bad_request()
    elif bookmarkID:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        bookmark = db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmarkID).first()
        if bookmark is None:
            close_session(db)
            return make_response('Bookmark not found.', 404)
        trip = db.query(Trip).filter(Trip.tripID == bookmark.tripID).first()
        if trip is None:
            close_session(db)
            return make_response('Trip for given Bookmark not found.', 404)
        userName = trip.userName

        if request.method == DELETE:
            if userName != curr_userName:
                close_session(db)
                return make_response('User not authorized to delete Bookmark.',
                                     401)
            db.delete(bookmark)
            close_session(db)
            return make_response('Bookmark deleted successfully', 200)
    return bad_request()


@app.route(VER_PATH + '/login', methods=[POST], strict_slashes=False)
def login():
    """ /:{version}/login
    Route for login. On success, sets the session KEY__LOGGED_IN flag to True.
    """
    try:
        post_userName = str(request.json['userName'])
        post_password = str(request.json['password'])
    except KeyError:
        return bad_request()

    print('Trying login for userName="%s", password="%s"' % (
        post_userName, post_password))
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
    return return_string


if __name__ == '__main__' or __name__ == '__init__':
    print(gethostname())
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
                   None, None, True, None, 1)
    event2 = Event(2, 'testVancouver',
                   to_datetime('Tue, 12 Aug 2013 17:17:17 GMT'),
                   to_datetime('Tue, 12 Aug 2013 18:18:18 GMT'),
                   49.267132, -122.968941, True, None, 1)
    event3 = Event(3, 'testAustralia',
                   to_datetime('Tue, 12 Aug 2013 17:17:17 GMT'),
                   to_datetime('Tue, 12 Aug 2013 18:18:18 GMT'),
                   -33.870943, 151.190311, True,
                   to_datetime('Tue, 12 Aug 2013 17:00:00 GMT'), 1)
    db_session.add_all([event1, event2, event3])
    # Example locations:
    bookmark1 = Bookmark(1, -33.866891, 151.200814,
                         '45a27fd8d56c56dc62afc9b49e1d850440d5c403',
                         'oneName', 'oneAddress', 'oneType',
                         1, None)
    bookmark2 = Bookmark(2, -33.870943, 151.190311,
                         '30bee58f819b6c47bd24151802f25ecf11df8943',
                         'twoName', 'twoAddress', 'twoType',
                         1, 3)
    db_session.add_all([bookmark1, bookmark2])
    db_session.commit()
    print_database()

    # TODO: All of the following should go into a testing file.
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

    if 'liveweb' not in gethostname():
        # Local hosting.
        # Host at 'http://localhost:4000/' and allow reloading on code changes.
        app.run(debug=True, host='0.0.0.0', port=4000, use_reloader=True)
