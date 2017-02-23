#!/usr/bin/env python
""" This file contains all the REST API routes and the server initialization.
"""
from os import urandom
from datetime import datetime
from socket import gethostname
from flask import Flask, session, request, make_response, jsonify
from flask import render_template  # TODO: remove along with index()
from sqlalchemy.orm import sessionmaker, scoped_session
# Our defined modules.
from base import base, engine
from models import User, Trip


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
LOGGED_IN_KEY = 'logged_in'
USERNAME_KEY = 'user_name'


# Generic responses. Function instead of a var because requires app context.
def bad_request():
    return make_response('Bad request.', 400)


def create_db_session():
    """Return a new SQLAlchemy database session."""
    database_session = scoped_session(sessionmaker(bind=engine))
    """:type: sqlalchemy.orm.Session"""
    return database_session


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
    if session.get(LOGGED_IN_KEY):
        return 'Logged in. <a href="' + VER_PATH + '/logout">Logout</a>'
    else:
        return render_template('login.html')


@app.route(VER_PATH + '/login', methods=[POST], strict_slashes=False)
def login():
    """ /:{version}/login
    Route for login. On success, sets the session LOGGED_IN_KEY flag to True.
    """
    try:
        post_userName = str(request.form['userName'])
        post_password = str(request.form['password'])
    except KeyError:
        return bad_request()

    print('Trying login for userName="%s", password="%s"' % (
        post_userName, post_password))
    db_session = create_db_session()
    result = db_session.query(User).filter(
        User.userName == post_userName,
        User.password == post_password).first()

    if not result:
        return make_response('Incorrect login details.', 401)

    session[LOGGED_IN_KEY] = True
    session[USERNAME_KEY] = post_userName
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
    db = create_db_session()
    user1 = User('admin', 'admin', 'Ad Min', 6046046004)
    user2 = User('user2', 'user2', 'Us Er2', 6042222222)
    db.add_all([user1, user2])
    trip1 = Trip(1, 'admin_trip', True,
                 datetime.now(), datetime.now(),
                 'admin')
    trip2 = Trip(2, 'user2_trip', True,
                 datetime.now(), datetime.now(),
                 'user2')
    db.add_all([trip1, trip2])
    db.commit()
    print_database()

    """
    # DELETING:
    query = db.query(User).filter(User.userName=='admin').first()
    db.delete(query)
    db.commit()

    # UPDATING:
    query = db.query(User).filter(User.userName=='user2').first()
    query.userName = 'changeTEST'
    db.commit()

    print_database()
    """
    if 'liveweb' not in gethostname():
        # Local hosting.
        # Host at 'http://localhost:4000/' and allow reloading on code changes.
        app.run(debug=True, host='0.0.0.0', port=4000, use_reloader=True)
