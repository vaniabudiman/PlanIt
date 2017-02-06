#!/usr/bin/env python
import flask
import os
from socket import gethostname

import sqlalchemy
import dummy_def
from user_def import *

# User database engine
engine = create_engine(USER_DATABASE, echo=True)

# App initialization
# __name__ handles this being a main program vs an imported module
app = flask.Flask(__name__)
# Set random secret key used for signing sessions.
app.secret_key = os.urandom(12)


@app.route('/')
def index():
    if not flask.session.get('logged_in'):
        return flask.render_template('login.html')
    else:
        return 'Logged in. <a href="/logout">Logout</a>'

@app.route('/add')
def add_page():
    return flask.render_template('add.html')

@app.route('/next')
def index_next():
    return 'Hi again!'

@app.route('/login', methods=['POST'])
def do_admin_login():
    POST_USERNAME = str(flask.request.form['username'])
    POST_PASSWORD = str(flask.request.form['password'])
 
    
    s = sqlalchemy.orm.sessionmaker(bind=engine)()
    query = s.query(User).filter(User.username.in_([POST_USERNAME]), User.password.in_([POST_PASSWORD]) )
    result = query.first()
    if result:
        flask.session['logged_in'] = True
    else:
        flask.flash('wrong password!')
    return index()

@app.route('/add', methods=['POST'])
def test_add():
    POST_ADD = str(flask.request.form['toadd'])
    print(POST_ADD)
    s = sqlalchemy.orm.sessionmaker(bind=engine)()
    user = User(POST_ADD,"test")
    s.add(user)
     
    # commit the record the database
    s.commit()
     
    s.commit()

    inspector = sqlalchemy.inspect(engine)
    for table_name in inspector.get_table_names():
       for column in inspector.get_columns(table_name):
           print("Column: %s" % column['name'])
    return " ".join(inspector.get_columns(inspector.get_table_names()[0]))

@app.route("/logout")
def logout():
    flask.session['logged_in'] = False
    return index()

@app.route("/view_database")
def view_database():
    if not flask.session.get('logged_in'):
        return flask.render_template('login.html')
    else:
        table_name = sqlalchemy.inspect(engine).get_table_names()[0]
        db_metadata = sqlalchemy.MetaData(engine)
        table_object = sqlalchemy.Table(table_name, db_metadata, autoload=True)
        table_fetchall = table_object.select().execute().fetchall()
        return "<br/>x".join([" ".join([str(col) for col in entry]) for entry in table_fetchall])


if __name__ == '__main__':
    # Don't run the app if not running locally eg. if running on PythonAnywhere
    if 'liveconsole' not in gethostname():
        print(gethostname())
        dummy_def.addDummyData()
        app.run(debug=True,host='0.0.0.0', port=4000)









