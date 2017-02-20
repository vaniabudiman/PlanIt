#!/usr/bin/env python
from base import base, engine
import flask
import os
import datetime
from socket import gethostname
from models import User, Trip
from sqlalchemy.orm import sessionmaker, scoped_session

# Versioning.
VERSION = 'v1'
VER_PATH = '/' + VERSION

# App initialization.
app = flask.Flask(__name__)
# Secret key for signing sessions.
app.secret_key = os.urandom(12)

# Session key variables.
LOGGED_IN_KEY = 'logged_in'


"""
Return a new SQLAlchemy database session.
"""
def create_session():
    return scoped_session(sessionmaker(bind=engine))

"""
Print out the entire database.
"""
def print_database():
    print("VVVVVVVVVVVVV")
    print(view_database().replace('<br/>', '\n'))
    print("^^^^^^^^^^^^^")

""" /:{version}/
Route for local testing. For graphical HTML view at hosted address.
"""
@app.route(VER_PATH + '/')
def index():
    if flask.session.get(LOGGED_IN_KEY):
        return 'Logged in. <a href="' + VER_PATH + '/logout">Logout</a>'
    else:
        return flask.render_template('login.html')

""" /:{version}/login
Route for login. On success, sets the session logged in flag to True.
"""
@app.route(VER_PATH + '/login', methods=['POST'])
def login():
    print("LOGGING IN")
    post_userName = str(flask.request.form['userName'])
    post_password = str(flask.request.form['password'])
    print(post_userName, post_password)

    db_session = create_session()
    query = db_session.query(User).filter(
        User.userName==post_userName,
        User.password==post_password)
    result = query.first()
    if result:
        flask.session[LOGGED_IN_KEY] = True
    else:
        flask.flash('Login failed!')
    return index()

""" /:{version}/login
Route for logout. Sets the session logged in flag to False.
"""
@app.route(VER_PATH + '/logout', methods=['POST'])
def logout():
    flask.session[LOGGED_IN_KEY] = False
    return index()

""" /:{version}/view_database
Route for testing. Returns the entire database as a string.
"""
@app.route(VER_PATH + '/view_database')
def view_database():
    from sqlalchemy import MetaData
    return_string = ''
    # Load all tables.
    metaData = MetaData()
    metaData.reflect(engine)
    for table in metaData.tables.values():
        return_string += '<br/>TABLE: ' + table.name
        for row in db.query(table).all():
            return_string += '<br/>   ' + ' | '.join(str(i) for i in row)
    return return_string

if __name__ == '__main__':
    # Local server hosting.
    if 'liveconsole' not in gethostname():
        print(gethostname())
        # Remove all entries.
        base.metadata.drop_all(bind=engine)
        # Create tables.
        base.metadata.create_all(bind=engine)

        """
        Example database operations.
        """
        # ADDING:
        db = create_session()
        user1 = User('admin', 'admin', 'Ad Min', 6046046004)
        user2 = User('user2', 'user2', 'Us Er2', 6042222222)
        db.add_all([user1, user2])
        trip1 = Trip(1, 'admin_trip', True,
                     datetime.datetime.now(), datetime.datetime.now(),
                     'admin')
        trip2 = Trip(2, 'user2_trip', True,
                     datetime.datetime.now(), datetime.datetime.now(),
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

        # Host at 'http://localhost:4000/' and allow reloading on code changes.
        app.run(debug=True, host='0.0.0.0', port=4000, use_reloader=True)
