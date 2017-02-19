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

def create_session():
    return scoped_session(sessionmaker(bind=engine))

@app.route(VER_PATH + '/')
def index():
    if flask.session.get(LOGGED_IN_KEY):
        return 'Logged in. <a href="' + VER_PATH + '/logout">Logout</a>'
    else:
        return flask.render_template('login.html')

@app.route(VER_PATH + '/login', methods=['POST'])
def login():
    print("LOGGING IN")
    post_userName = str(flask.request.form['userName'])
    post_password = str(flask.request.form['password'])
    print(post_userName, post_password)

    db_session = create_session()
    query = db_session.query(User).filter(
        User.userName.in_([post_userName]),
        User.password.in_([post_password]))
    result = query.first()
    if result:
        flask.session[LOGGED_IN_KEY] = True
    else:
        flask.flash('Login failed!')
    return index()

@app.route(VER_PATH + '/logout', methods=['POST'])
def logout():
    flask.session[LOGGED_IN_KEY] = False
    return index()

@app.route(VER_PATH + '/view_database')
def view_database():
    from sqlalchemy import inspect, MetaData, Table
    return_string = ''
    db_metadata = MetaData(engine)
    table_names = inspect(engine).get_table_names()
    for table in table_names:
        table_object = Table(table, db_metadata, autoload=True)
        table_fetchall = table_object.select().execute().fetchall()
        return_string += "<br/>" + "<br/>".join(
            [" ".join([str(col) for col in entry]) for entry in table_fetchall])
    return return_string

if __name__ == '__main__':
    # Local server hosting.
    if 'liveconsole' not in gethostname():
        print(gethostname())
        # Remove all entries.
        base.metadata.drop_all(bind=engine)
        # Create tables.
        base.metadata.create_all(bind=engine)

        # Adding dummy data.
        local_db_session = create_session()
        user1 = User('admin', 'admin', 'Ad Min', 6046046004)
        local_db_session.add(user1)
        trip1 = Trip(1, 'admin_trip', True,
                     datetime.datetime.now(), datetime.datetime.now(),
                     'admin')
        local_db_session.add(trip1)
        local_db_session.commit()

        print("=============")
        print(view_database().replace('<br/>', '\n'))
        print("=============")

        # Host at 'http://localhost:4000/'.
        app.run(debug=True, host='0.0.0.0', port=4000)
