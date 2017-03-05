#!/usr/bin/env python
""" This file contains all the REST API routes and the server initialization.
"""
from os import urandom
from datetime import datetime
from socket import gethostname
from flask import Flask, session, request, make_response, jsonify
from flask import render_template  # TODO: remove along with index()
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.sql import func
# Our defined modules.
from base import base, engine
from models import User, Trip, Event, Bookmark

# Versioning.
VERSION = 'v1'
VER_PATH = '/' + VERSION

# App initialization.
app = Flask(__name__)
# Secret key for signing sessions.
app.secret_key = urandom(12)

# HTTP call methods.
POST = 'POST'
GET = 'GET'
PUT = 'PUT'
DELETE = 'DELETE'

# Session key variables.
KEY__LOGGED_IN = 'logged_in'
KEY__USERNAME = 'user_name'

# DateTime string format.
# https://docs.python.org/2/library/datetime.html#strftime-strptime-behavior
#  %Y: Year with century as a decimal number. 1970, 1988, 2001, 2013
#  %b: Month as locale’s abbreviated name. Jan, Feb, ..., Dec
#  %d: Day of the month as a zero-padded decimal number. 01, 02, ..., 31
#  %H: Hour (24-hour clock) as a zero-padded decimal number. 00, 01, ..., 23
#  %M: Minute as a zero-padded decimal number. 00, 01, ..., 59
DT_FORMAT = '%Y%b%d%H%M'


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
            post_phoneNumber = int(request.json['phoneNumber'])
        except KeyError:
            return bad_request()

        db = create_db_session()
        db.add(User(post_userName, post_password, post_name, post_phoneNumber))
        try:
            db.commit()
            return make_response('User "%s" POST success.' % post_userName, 201)
        except IntegrityError:
            db.rollback()
            return make_response('Conflict - Username taken.', 409)
        finally:
            close_session(db)
    elif request.method == GET:
        db = create_db_session()
        curr_userName = session.get(KEY__USERNAME)
        query = db.query(User).filter(User.userName == curr_userName).first()
        if not query:
            close_session(db)
            return make_response('User not found.', 404)
        ret_dict = {'user': query.to_dict()}
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
            except KeyError:
                pass

            try:
                # Optional name parameter.
                post_name = str(request.json['name'])
                query.name = post_name
            except KeyError:
                pass

            try:
                # Optional phoneNumber parameter.
                post_phoneNumber = int(request.json['phoneNumber'])
                query.phoneNumber = post_phoneNumber
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
    user1 = User('admin', 'admin', 'Ad Min', 6046046004)
    user2 = User('user2', 'user2', 'Us Er2', 6042222222)
    db_session.add_all([user1, user2])
    trip1 = Trip(1, 'admin_trip', True,
                 datetime.now(), datetime.now(),
                 'admin')
    trip2 = Trip(2, 'user2_trip', True,
                 datetime.now(), datetime.now(),
                 'user2')
    db_session.add_all([trip1, trip2])
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
