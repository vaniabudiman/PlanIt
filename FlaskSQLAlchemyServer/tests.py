# Unit testing module.
import unittest
from unittest import TestCase, main
# Flask session and response status codes.
from flask import session
from flask_api.status import *
# Json handling.
import json
from copy import copy, deepcopy
# Verbose text handling.
from textwrap import wrap

# Server constants.
from __init__ import app, base, engine
from __init__ import VERSION, VER_PATH, KEY__USERNAME, KEY__LOGGED_IN
from __init__ import PLANIT_EMAIL
# Server utilities.
from __init__ import make_version_path, create_db_session
from datetime import datetime
# Models.
from models import DT_FORMAT
from models import User, Trip, Event, Bookmark
from models import Permissions, PermissionsEnum, Transportation, TransportEnum
from sqlalchemy import and_

verbose = True
app.config['TESTING'] = True


def print_data(response):
    if verbose:
        print('\t' + response.status)
        print('\t' + '\n\t'.join(wrap(str(response.data))))


def print_title(title):
    if verbose:
        print('TEST: ' + title)

# /users
user1_username = 'user1'
user1_password = 'user1Password'
user1_name     = 'User1 Name'
user1_email    = 'user1email.com'  # Deliberate invalid email.
user1_currency = 'ABC'
user2_username = 'user2'
user2_password = 'user2Password'
user2_name     = 'User2 Name'
user2_email    = PLANIT_EMAIL
user2_currency = 'XYZ'

# /trips
trip1_tripID = 1
trip1_tripName = 'Trip1 Name'
trip1_active = True
trip1_startDate = datetime.strptime(
    'Tue, 01 Mar 2017 01:01:01 GMT', DT_FORMAT)
trip1_endDate = datetime.strptime(
    'Tue, 01 Mar 2017 11:11:11 GMT', DT_FORMAT)
trip1_userName = user1_username
tripx_tripID = 99

# /transportation
transport1_transportID = 1
transport1_type = TransportEnum('car')
transport1_operator = 'Transportation1Operator'
transport1_number = '1234'
transport1_depAddr = 'Transportation1 Departure Address'
transport1_arrAddr = 'Transportation1 Arrival Address'
transport1_eventID = 1
event1_eventID = 1
event1_eventName = 'Event1 Name'
event1_startDate = datetime.strptime(
    'Tue, 05 Mar 2017 01:01:01 GMT', DT_FORMAT)
event1_endDate = datetime.strptime(
    'Tue, 06 Mar 2017 11:11:11 GMT', DT_FORMAT)
event1_lat = -33.870943
event1_lon = 151.190311
event1_remFlag = False
event1_remTime = None
event1_addr = None
event1_shared = False
event1_tripID = 1
eventx_eventID = tripx_tripID

# /events
event2_eventID = 2
event2_eventName = 'Event2 Name'
event2_startDate = datetime.strptime(
    'Tue, 07 Mar 2017 01:01:01 GMT', DT_FORMAT)
event2_endDate = datetime.strptime(
    'Tue, 08 Mar 2017 11:11:11 GMT', DT_FORMAT)
event2_lat = 151.190311
event2_lon = -33.870943
event2_remFlag = False
event2_remTime = None
event2_addr = None
event2_shared = False
event2_tripID = 1
trip2_tripID = 2
trip2_tripName = 'Trip1 Name'
trip2_active = True
trip2_startDate = datetime.strptime(
    'Tue, 01 Mar 2017 01:01:01 GMT', DT_FORMAT)
trip2_endDate = datetime.strptime(
    'Tue, 01 Mar 2017 11:11:11 GMT', DT_FORMAT)
trip2_userName = user2_username

# /bookmarks
bookmark1_bookmarkID = 1
bookmark1_lat = 49.2827
bookmark1_lon = -123.1207
bookmark1_placeID = '45a27fd8d56c56dc62afc9b49e1d850440d5c403'
bookmark1_name = 'Bookmark1 Name'
bookmark1_addr = 'Bookmark1 Address'
bookmark1_type = 'Bookmark1 Type'
bookmark1_shared = None
bookmark1_tripID = 1
bookmark1_eventID = None
bookmarkx_bookmarkID = tripx_tripID

# /share
perm1b_permissionID = 1  # Referring to bookmark1_bookmarkID.
perm1b_type = PermissionsEnum.BOOKMARK
perm1b_writeFlag = False
perm1b_toUser = user2_username
perm1b_toTrip = trip2_tripID


def common_setup():
    print()
    # Empty and recreate all tables.
    base.metadata.drop_all(bind=engine)
    base.metadata.create_all(bind=engine)
    # Add entries.
    db = create_db_session()
    db.add_all([User(user1_username, user1_password, user1_name,
                     user1_email, user1_currency),
                User(user2_username, user2_password, user2_name,
                     user2_email, user2_currency),
                Trip(trip1_tripID, trip1_tripName, trip1_active,
                     trip1_startDate, trip1_endDate, trip1_userName),
                Transportation(transport1_transportID, transport1_type,
                               transport1_operator, transport1_number,
                               transport1_depAddr, transport1_arrAddr,
                               transport1_eventID),
                Event(event1_eventID, event1_eventName, event1_startDate,
                      event1_endDate, event1_lat, event1_lon, event1_remFlag,
                      event1_remTime, event1_addr, event1_shared,
                      event1_tripID),
                Event(event2_eventID, event2_eventName, event2_startDate,
                      event2_endDate, event2_lat, event2_lon, event2_remFlag,
                      event2_remTime, event2_addr, event2_shared,
                      event2_tripID),
                Trip(trip2_tripID, trip2_tripName, trip2_active,
                     trip2_startDate, trip2_endDate, trip2_userName),
                Bookmark(bookmark1_bookmarkID, bookmark1_lat,
                         bookmark1_lon, bookmark1_placeID,
                         bookmark1_name, bookmark1_addr,
                         bookmark1_type, bookmark1_shared,
                         bookmark1_tripID, bookmark1_eventID),
                Permissions(perm1b_permissionID, perm1b_type, perm1b_writeFlag,
                            perm1b_toUser, perm1b_toTrip)])
    db.commit()
    db.close()


def login_helper_user1(self_app):
    data = json.dumps({User.KEY__USERNAME: user1_username,
                       User.KEY__PASSWORD: user1_password})
    login_path = VER_PATH + '/login'
    return self_app.post(login_path, data=data,
                         content_type='application/json')


def login_helper_user2(self_app):
    data = json.dumps({User.KEY__USERNAME: user2_username,
                       User.KEY__PASSWORD: user2_password})
    login_path = VER_PATH + '/login'
    return self_app.post(login_path, data=data,
                         content_type='application/json')


class Users(TestCase):
    usera_username = 'usera'
    usera_password = 'useraPassword'
    usera_name     = 'Usera Name'
    usera_email    = PLANIT_EMAIL  # Using an email that we know exists.
    usera_currency = 'DEF'

    userx_username = 'userx'
    userx_password = 'userxPassword'
    userx_name     = 'Userx Name'
    userx_email    = 'userx@email.com'
    userx_currency = 'GHI'

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Add a user and remove it so that we know that it won't exist.
        userx = User(self.userx_username, self.userx_password, self.userx_name,
                     self.userx_email, self.userx_currency)
        db.add(userx)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(userx)
        db.commit()
        db.close()

    def test_login(self):
        print_title('without_version_path')
        rv = self.app.post('/login')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('incorrect_version_path')
        rv = self.app.post(make_version_path(VERSION + 1) + '/login')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('without_JSON_request')
        login_path = VER_PATH + '/login'
        rv = self.app.post(login_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_JSON_request')
        user1 = {User.KEY__USERNAME: user1_username,
                 User.KEY__PASSWORD: user1_password}
        rv = self.app.post(login_path, data=dict(user1))
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('empty_JSON_request')
        rv = self.app.post(login_path, data=dict(),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_password')
        rv = self.app.post(login_path, data=json.dumps(
            {User.KEY__USERNAME: 'abc'}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_username')
        rv = self.app.post(login_path, data=json.dumps(
            {User.KEY__PASSWORD: 'abc'}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_logged_in')
        with self.app as client:
            client.get()
            self.assertNotIn(KEY__USERNAME, session)
            self.assertNotIn(KEY__LOGGED_IN, session)

        print_title('login_success')
        rv = login_helper_user1(self.app)
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)

        print_title('is_logged_in')
        with self.app as client:
            client.get()
            self.assertIn(KEY__USERNAME, session)
            self.assertEqual(session[KEY__USERNAME], user1_username)
            self.assertIn(KEY__LOGGED_IN, session)
            self.assertTrue(session[KEY__LOGGED_IN])

        print_title('login_wrong_password')
        data = json.dumps({User.KEY__USERNAME: user1_username,
                           User.KEY__PASSWORD: user1_password + 'a'})
        rv = self.app.post(login_path, data=data,
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('login_wrong_username')
        data = json.dumps({User.KEY__USERNAME: user1_username + 'a',
                           User.KEY__PASSWORD: user1_password})
        rv = self.app.post(login_path, data=data,
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('login_with_deleted_user')
        data = json.dumps({User.KEY__USERNAME: self.userx_username,
                           User.KEY__PASSWORD: self.userx_password})
        rv = self.app.post(login_path, data=data,
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

    def test_logout(self):
        print_title('without_version_path')
        rv = self.app.post('/logout')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('empty_session')
        with self.app as client:
            client.get()
            self.assertNotIn(KEY__USERNAME, session)
            self.assertNotIn(KEY__LOGGED_IN, session)

        print_title('still_empty_session_after_logout')
        logout_path = VER_PATH + '/logout'
        rv = self.app.post(logout_path)
        self.assertIn(str(HTTP_200_OK), rv.status)
        with self.app as client:
            client.get()
            self.assertNotIn(KEY__USERNAME, session)
            self.assertNotIn(KEY__LOGGED_IN, session)

        print_title('logout_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        with self.app as client:
            client.get()
            self.assertEquals(session[KEY__USERNAME], user1_username)
            self.assertTrue(session[KEY__LOGGED_IN])
        rv = self.app.post(logout_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        with self.app as client:
            client.get()
            self.assertNotIn(KEY__USERNAME, session)
            self.assertNotIn(KEY__LOGGED_IN, session)

    def test_users_post(self):
        print_title('without_JSON_request')
        users_path = VER_PATH + '/users'
        rv = self.app.post(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_JSON_request')
        usera = User(self.usera_username, self.usera_password,
                     self.usera_name, self.usera_email, self.usera_currency)
        rv = self.app.post(users_path, data=dict(usera.to_dict()))
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('post_success')
        rv = self.app.post(users_path, data=json.dumps(usera.to_dict()),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        self.assertEqual(usera.to_dict(), db.query(User).filter(
            User.userName == usera.userName).first().to_dict())

        print_title('duplicate_user')
        rv = self.app.post(users_path, data=json.dumps(usera.to_dict()),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_409_CONFLICT), rv.status)

        print_title('without_homeCurrency')
        usera_dict = usera.to_dict()
        usera_dict.pop(User.KEY__CURRENCY)
        rv = self.app.post(users_path, data=json.dumps(usera_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_email')
        usera_dict.pop(User.KEY__EMAIL)
        rv = self.app.post(users_path, data=json.dumps(usera_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_name')
        usera_dict.pop(User.KEY__NAME)
        rv = self.app.post(users_path, data=json.dumps(usera_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_password')
        usera_dict.pop(User.KEY__PASSWORD)
        rv = self.app.post(users_path, data=json.dumps(usera_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_userName')
        usera_dict.pop(User.KEY__USERNAME)
        rv = self.app.post(users_path, data=json.dumps(usera_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_users_get(self):
        print_title('without_arguments')
        users_path = VER_PATH + '/users'
        rv = self.app.get(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('empty_request')
        rv = self.app.get(users_path, query_string={})
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('logged_in_without_arugments')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO#1: Compare JSON response... support for JSON not merged yet:
        #       https://github.com/pallets/flask/pull/1984

        print_title('get_own_user')
        rv = self.app.get(users_path, query_string={
            User.KEY__USERNAME: user1_username})
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('get_other_existing_user')
        usera = User(self.usera_username, self.usera_password,
                     self.usera_name, self.usera_email, self.usera_currency)
        self.app.post(users_path, data=json.dumps(usera.to_dict()),
                      content_type='application/json')
        self.assertIn(str(HTTP_200_OK), rv.status)
        rv = self.app.get(users_path, query_string={
            User.KEY__USERNAME: self.usera_username})
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('get_other_nonexistent_user')
        rv = self.app.get(users_path, query_string={
            User.KEY__USERNAME: self.userx_username})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('own_user_is_deleted')
        db = create_db_session()
        db.delete(db.query(User).filter(
            User.userName == user1_username).first())
        db.commit()
        rv = self.app.get(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_users_put(self):
        print_title('not_logged_in')
        users_path = VER_PATH + '/users/' + user1_username
        rv = self.app.put(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('nonexistent_user')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        users_path = VER_PATH + '/users/' + self.userx_username
        rv = self.app.put(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('authorized_not_JSON')
        users_path = VER_PATH + '/users/' + user1_username
        rv = self.app.put(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('authorized_without_params')
        rv = self.app.put(users_path, content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('authorized_empty_json')
        rv = self.app.put(users_path, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('change_name')
        suffix = 'abc'
        data = {User.KEY__NAME: user1_username + suffix}
        rv = self.app.put(users_path, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        user = db.query(User).filter(
            User.userName == user1_username).first()
        self.assertEqual(user.name, user1_username + suffix)
        db.close()

        print_title('change_password_fail_email')
        data = {User.KEY__PASSWORD: user1_password + suffix}
        rv = self.app.put(users_path, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        # Should fail with the invalid email.
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_email')
        data = {User.KEY__EMAIL: PLANIT_EMAIL}
        rv = self.app.put(users_path, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        user = db.query(User).filter(
            User.userName == user1_username).first()
        self.assertEqual(user.email, PLANIT_EMAIL)
        db.close()

        print_title('change_password')
        data = {User.KEY__PASSWORD: user1_password + suffix}
        rv = self.app.put(users_path, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        user = db.query(User).filter(
            User.userName == user1_username).first()
        self.assertEqual(user.password, user1_password + suffix)
        db.close()

        print_title('change_currency')
        data = {User.KEY__CURRENCY: user1_currency + suffix}
        rv = self.app.put(users_path, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        user = db.query(User).filter(
            User.userName == user1_username).first()
        self.assertEqual(user.homeCurrency, user1_currency + suffix)
        db.close()

        print_title('put_self_not_found')
        rv = self.app.delete(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        rv = self.app.put(users_path, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_users_delete(self):
        print_title('not_logged_in')
        users_path = VER_PATH + '/users/' + user1_username
        rv = self.app.delete(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('authorized_but_delete_other_user')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        users_path_x = VER_PATH + '/users/' + self.userx_username
        rv = self.app.delete(users_path_x)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('delete_success')
        rv = self.app.delete(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('logged_in_but_user_deleted')
        rv = self.app.delete(users_path)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)


class Trips(TestCase):
    tripa_tripID = 3
    tripa_tripName = 'TripA Name'
    tripa_active = True
    tripa_startDate = 'Tue, 02 Mar 2017 01:01:01 GMT'
    tripa_endDate = 'Tue, 02 Mar 2017 11:11:11 GMT'
    tripa_userName = user2_username

    tripx_tripID = 4
    tripx_tripName = 'TripX Name'
    tripx_active = True
    tripx_startDate = datetime.strptime(
        'Tue, 03 Mar 2017 01:01:01 GMT', DT_FORMAT)
    tripx_endDate = datetime.strptime(
        'Tue, 03 Mar 2017 11:11:11 GMT', DT_FORMAT)
    tripx_userName = user1_username

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Add a Trip and remove it so that we know that it won't exist.
        tripx = Trip(self.tripx_tripID, self.tripx_tripName,
                     self.tripx_active, self.tripx_startDate,
                     self.tripx_endDate, self.tripx_userName)
        db.add(tripx)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(tripx)
        db.commit()
        db.close()

    def test_trips_post(self):
        print_title('without_JSON_request')
        trips_path = VER_PATH + '/trips'
        rv = self.app.post(trips_path)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('without_JSON_request')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.post(trips_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_JSON_request')
        tripa_dict = {Trip.KEY__ID: self.tripa_tripID,
                      Trip.KEY__TRIPNAME: self.tripa_tripName,
                      Trip.KEY__ACTIVE: self.tripa_active,
                      Trip.KEY__STARTDATE: self.tripa_startDate,
                      Trip.KEY__ENDDATE: self.tripa_endDate,
                      Trip.KEY__USERNAME: self.tripa_userName}
        rv = self.app.post(trips_path, data=dict(tripa_dict))
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('post_success')
        rv = self.app.post(trips_path, data=json.dumps(tripa_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        tripa_dict[Trip.KEY__STARTDATE] = datetime.strptime(
            tripa_dict[Trip.KEY__STARTDATE], DT_FORMAT).strftime(DT_FORMAT)
        tripa_dict[Trip.KEY__ENDDATE] = datetime.strptime(
            tripa_dict[Trip.KEY__ENDDATE], DT_FORMAT).strftime(DT_FORMAT)
        self.assertEqual(tripa_dict, db.query(Trip).filter(
            Trip.tripID == tripa_dict[Trip.KEY__ID]).first().to_dict())

        print_title('without_endDate')
        tripa_dict.pop(Trip.KEY__ID)
        tripa_dict.pop(Trip.KEY__USERNAME)
        tripa_dict.pop(Trip.KEY__ENDDATE)
        rv = self.app.post(trips_path, data=json.dumps(tripa_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_startDate')
        tripa_dict.pop(Trip.KEY__STARTDATE)
        rv = self.app.post(trips_path, data=json.dumps(tripa_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_active')
        tripa_dict.pop(Trip.KEY__ACTIVE)
        rv = self.app.post(trips_path, data=json.dumps(tripa_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_tripName')
        tripa_dict.pop(Trip.KEY__TRIPNAME)
        rv = self.app.post(trips_path, data=json.dumps(tripa_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_trips_get(self):
        print_title('without_arguments')
        trips_path = VER_PATH + '/trips'
        rv = self.app.get(trips_path)
        print(rv.data)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)
        # TODO: see TODO#1

        print_title('logged_in_without_arugments')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(trips_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('found_own')
        rv = self.app.get(trips_path, query_string={
            Trip.KEY__ID: trip1_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('not_found')
        rv = self.app.get(trips_path, query_string={
            Trip.KEY__ID: self.tripx_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('no_trips')
        rv = login_helper_user2(self.app)
        db = create_db_session()
        db.delete(db.query(Trip).filter(Trip.tripID == trip2_tripID).first())
        db.commit()
        db.close()
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(trips_path)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('not_authorized')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        db.add(Trip(self.tripa_tripID, self.tripa_tripName, self.tripa_active,
                    datetime.strptime(self.tripa_startDate, DT_FORMAT),
                    datetime.strptime(self.tripa_endDate, DT_FORMAT),
                    self.tripa_userName))
        db.commit()
        db.close()
        rv = self.app.get(trips_path, query_string={
            Trip.KEY__ID: self.tripa_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

    def test_trips_put(self):
        print_title('not_logged_in')
        trips_path1 = VER_PATH + '/trips/' + str(trip1_tripID)
        rv = self.app.put(trips_path1)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('nonexistent_trip')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        trips_pathx = VER_PATH + '/trips/' + str(self.tripx_tripID)
        rv = self.app.put(trips_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('authorized_not_JSON')
        rv = self.app.put(trips_path1)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('authorized_without_params')
        rv = self.app.put(trips_path1, content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('authorized_empty_json')
        rv = self.app.put(trips_path1, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('not_owner_of_trip')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.put(trips_path1, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('change_tripName')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        suffix = 'abc'
        data = {Trip.KEY__TRIPNAME: trip1_tripName + suffix}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == trip1_tripID).first()
        self.assertEqual(trip.tripName, trip1_tripName + suffix)
        db.close()

        print_title('change_active')
        data = {Trip.KEY__ACTIVE: not trip1_active}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == trip1_tripID).first()
        self.assertEqual(trip.active, not trip1_active)
        db.close()

        print_title('change_startDate')
        data = {Trip.KEY__STARTDATE: self.tripa_startDate}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == trip1_tripID).first()
        self.assertEqual(trip.startDate,
                         datetime.strptime(self.tripa_startDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_startDate')
        not_a_dateTime = 'a'
        with self.assertRaises(ValueError):
            datetime.strptime(not_a_dateTime, DT_FORMAT)
        data = {Trip.KEY__STARTDATE: not_a_dateTime}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_endDate')
        data = {Trip.KEY__ENDDATE: self.tripa_endDate}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        trip = db.query(Trip).filter(Trip.tripID == trip1_tripID).first()
        self.assertEqual(trip.endDate,
                         datetime.strptime(self.tripa_endDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_endDate')
        data = {Trip.KEY__ENDDATE: not_a_dateTime}
        rv = self.app.put(trips_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_trips_delete(self):
        print_title('not_authorized_delete')
        db = create_db_session()
        db.add(Trip(self.tripa_tripID, self.tripa_tripName, self.tripa_active,
                    datetime.strptime(self.tripa_startDate, DT_FORMAT),
                    datetime.strptime(self.tripa_endDate, DT_FORMAT),
                    self.tripa_userName))
        db.commit()
        db.close()
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        trips_patha = VER_PATH + '/trips/' + str(self.tripa_tripID)
        rv = self.app.delete(trips_patha)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)
        db = create_db_session()
        self.assertIsNot(db.query(Trip).filter(
            Trip.tripID == self.tripa_tripID).first(), None)
        db.close()

        print_title('delete_success')
        trips_path1 = VER_PATH + '/trips/' + str(trip1_tripID)
        rv = self.app.delete(trips_path1)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Trip).filter(
            Trip.tripID == trip1_tripID).first(), None)
        db.close()


class Transportations(TestCase):
    transporta_transportID = 2
    transporta_type = TransportEnum('bus')
    transporta_operator = 'Transportation2Operator'
    transporta_number = '2345'
    transporta_depAddr = 'Transportation2 Departure Address'
    transporta_arrAddr = 'Transportation2 Arrival Address'
    transporta_eventID = 3
    transporta_depDate = 'Tue, 07 Mar 2017 01:01:01 GMT'
    transporta_arrDate = 'Tue, 08 Mar 2017 11:11:11 GMT'

    transportx_transportID = 3
    transportx_type = TransportEnum('sea')
    transportx_operator = 'Transportation3Operator'
    transportx_number = '3456'
    transportx_depAddr = 'Transportation3 Departure Address'
    transportx_arrAddr = 'Transportation3 Arrival Address'
    transportx_depDate = 'Tue, 17 Mar 2017 01:01:01 GMT'
    transportx_arrDate = 'Tue, 18 Mar 2017 11:11:11 GMT'

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Add a Trip and remove it so that we know that it won't exist.
        tx = Transportation(self.transportx_transportID, self.transportx_type,
                            self.transportx_operator, self.transportx_number,
                            self.transportx_depAddr, self.transportx_arrAddr,
                            self.transportx_transportID)
        db.add(tx)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(tx)
        db.commit()
        db.close()

    def test_transportation_post(self):
        print_title('without_JSON_request')
        transport_path = VER_PATH + '/transportation'
        rv = self.app.post(transport_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('post_not_authorized')
        ta = Transportation(self.transporta_transportID, self.transporta_type,
                            self.transporta_operator, self.transporta_number,
                            self.transporta_depAddr, self.transporta_arrAddr,
                            self.transporta_eventID)
        ta_dict = {Trip.KEY__ID: trip1_tripID,
                   'transportation': [ta.to_dict()]}
        ta_dict['transportation'][0][Transportation.KEY__DEPARTUREDATE] = \
            self.transporta_depDate
        ta_dict['transportation'][0][Transportation.KEY__ARRIVALDATE] = \
            self.transporta_arrDate
        rv = self.app.post(transport_path, data=json.dumps(ta_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('post_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.post(transport_path, data=json.dumps(ta_dict),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        q = db.query(Transportation).filter(
            Transportation.transportationID == ta.transportationID).first()
        self.assertEqual(ta.to_dict(), q.to_dict())
        db.close()

        print_title('trip_not_found')
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: tripx_tripID,
             'transportation': [ta.to_dict()]}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('empty_list')
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: trip1_tripID,
             'transportation': []}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_a_list')
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: trip1_tripID,
             'transportation': ta.to_dict()}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_a_transportation_enum')
        not_a_transport_enum = 'abc'
        with self.assertRaises(ValueError):
            TransportEnum(not_a_transport_enum)
        orig_ta_dict = ta.to_dict()
        orig_ta_dict[Transportation.KEY__DEPARTUREDATE] = \
            self.transporta_depDate
        orig_ta_dict[Transportation.KEY__ARRIVALDATE] = self.transporta_arrDate
        ta_dict = orig_ta_dict
        ta_dict[Transportation.KEY__TYPE] = not_a_transport_enum
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: trip1_tripID,
             'transportation': [ta_dict]}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_a_dep_datetime')
        not_a_datetime = 'abc'
        with self.assertRaises(ValueError):
            datetime.strptime(not_a_datetime, DT_FORMAT)
        ta_dict = orig_ta_dict
        ta_dict[Transportation.KEY__DEPARTUREDATE] = not_a_datetime
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: trip1_tripID,
             'transportation': [ta_dict]}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_a_arr_datetime')
        ta_dict = orig_ta_dict
        ta_dict[Transportation.KEY__ARRIVALDATE] = not_a_datetime
        rv = self.app.post(transport_path, data=json.dumps(
            {Trip.KEY__ID: trip1_tripID,
             'transportation': [ta_dict]}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_transportation_get(self):
        print_title('without_arguments')
        transport_path = VER_PATH + '/transportation'
        rv = self.app.get(transport_path)
        print(rv.data)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('trip_not_found')
        rv = self.app.get(transport_path, query_string={
            Trip.KEY__ID: tripx_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_found_but_not_authorized')
        trip1_key_dict = {Trip.KEY__ID: trip1_tripID}
        rv = self.app.get(transport_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('found_own')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(transport_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('no_transportation_found_for_trip')
        db = create_db_session()
        db.add(Trip(tripx_tripID, 'a', True,
                    trip1_startDate, trip1_endDate, trip1_userName))
        db.commit()
        db.close()
        rv = self.app.get(transport_path, query_string={
            Trip.KEY__ID: tripx_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('transportation_not_found')
        rv = self.app.get(transport_path, query_string={
            Transportation.KEY__ID: self.transportx_transportID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('transportation_found')
        transport1_key_dict = {Transportation.KEY__ID: transport1_transportID}
        rv = self.app.get(transport_path, query_string=transport1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('not_authorized_shared_attempt')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(transport_path, query_string=transport1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('event_not_found')
        db = create_db_session()
        db.add(Transportation(self.transporta_transportID,
                              self.transporta_type,
                              self.transporta_operator,
                              self.transporta_number,
                              self.transporta_depAddr,
                              self.transporta_arrAddr,
                              self.transporta_eventID))
        db.commit()
        db.close()
        rv = self.app.get(transport_path, query_string={
            Transportation.KEY__ID: transport1_transportID + 1})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_not_found')
        db = create_db_session()
        db.delete(db.query(Trip).filter(
            Trip.tripID == trip1_tripID + 1).first())
        db.add(Event(self.transporta_eventID, event1_eventName,
                     event1_startDate, event1_endDate, event1_lat, event1_lon,
                     event1_remFlag, event1_remTime, event1_addr,
                     event1_shared, trip1_tripID + 1))
        db.commit()
        db.close()
        rv = self.app.get(transport_path, query_string={
            Transportation.KEY__ID: transport1_transportID + 1})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_transportation_put(self):
        print_title('transportation_not_found')
        transport_pathx = VER_PATH + '/transportation/' + str(
            self.transportx_transportID)
        rv = self.app.put(transport_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('existing_trip_not_authorized')
        transport_path1 = VER_PATH + '/transportation/' + str(
            transport1_transportID)
        rv = self.app.put(transport_path1, content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('authorized_no_changes')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.put(transport_path1, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('existing_trip_not_json')
        rv = self.app.put(transport_path1, data=json.dumps({}))
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_type')
        new_type = 'sea'
        self.assertNotEqual(transport1_type, new_type)
        data = {Transportation.KEY__TYPE: new_type}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        self.assertEqual(tr.type, TransportEnum(new_type))
        db.close()

        print_title('change_invalid_type')
        suffix = 'abc'
        with self.assertRaises(ValueError):
            TransportEnum(suffix)
        data = {Transportation.KEY__TYPE: suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_operator')
        data = {Transportation.KEY__OPERATOR: transport1_operator + suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        self.assertEqual(tr.operator, transport1_operator + suffix)
        db.close()

        print_title('change_number')
        data = {Transportation.KEY__NUMBER: transport1_number + suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        self.assertEqual(tr.number, transport1_number + suffix)
        db.close()

        print_title('change_departureDateTime')
        self.assertNotEqual(event1_startDate, self.transportx_depDate)
        data = {Transportation.KEY__DEPARTUREDATE: self.transportx_depDate}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        ev = db.query(Event).filter(Event.eventID == tr.eventID).first()
        self.assertEqual(ev.startDateTime,
                         datetime.strptime(self.transportx_depDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_departureDateTime')
        with self.assertRaises(ValueError):
            datetime.strptime(suffix, DT_FORMAT)
        data = {Transportation.KEY__DEPARTUREDATE: suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_arrivalDateTime')
        self.assertNotEqual(event1_endDate, self.transportx_arrDate)
        data = {Transportation.KEY__ARRIVALDATE: self.transportx_arrDate}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        ev = db.query(Event).filter(Event.eventID == tr.eventID).first()
        self.assertEqual(ev.endDateTime,
                         datetime.strptime(self.transportx_arrDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_arrivalDateTime')
        data = {Transportation.KEY__ARRIVALDATE: suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_departureAddress')
        data = {Transportation.KEY__DEPARTUREADDR: transport1_depAddr + suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        self.assertEqual(tr.departureAddress, transport1_depAddr + suffix)
        db.close()

        print_title('change_arrivalAddress')
        data = {Transportation.KEY__ARRIVALADDR: transport1_arrAddr + suffix}
        rv = self.app.put(transport_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        tr = db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first()
        self.assertEqual(tr.arrivalAddress, transport1_arrAddr + suffix)
        db.close()

        print_title('event_not_found')
        db = create_db_session()
        db.add(Transportation(self.transportx_transportID,
                              self.transportx_type,
                              self.transportx_operator,
                              self.transportx_number,
                              self.transportx_depAddr,
                              self.transportx_arrAddr,
                              self.transporta_eventID))
        db.commit()
        db.close()
        transport_pathx = VER_PATH + '/transportation/' + str(
            self.transportx_transportID)
        rv = self.app.put(transport_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_not_found')
        db = create_db_session()
        db.add(Event(self.transporta_eventID, event1_eventName,
                     event1_startDate, event1_endDate, event1_lat, event1_lon,
                     event1_remFlag, event1_remTime, event1_addr, event1_shared,
                     tripx_tripID))
        db.commit()
        db.close()
        transport_pathx = VER_PATH + '/transportation/' + str(
            self.transportx_transportID)
        rv = self.app.put(transport_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_transportation_delete(self):
        print_title('not_authorized_delete')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        transport_path = VER_PATH + '/transportation/' + str(
            transport1_transportID)
        rv = self.app.delete(transport_path)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)
        db = create_db_session()
        self.assertIsNot(db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first(),
                         None)
        db.close()

        print_title('delete_permission')
        db = create_db_session()
        db.add(Permissions(event1_eventID, PermissionsEnum('event'),
                           False, user2_username, trip1_tripID))
        db.commit()
        db.close()
        rv = self.app.delete(transport_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Permissions).filter(and_(
            Permissions.permissionID == event1_eventID,
            Permissions.toUser == user2_username,
            Permissions.toTrip == trip1_tripID)).first(), None)
        db.close()

        print_title('delete_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.delete(transport_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Transportation).filter(
            Transportation.transportationID == transport1_transportID).first(),
                      None)
        db.close()


class Events(TestCase):
    eventa_eventID = 3
    eventa_eventName = 'EventA Name'
    eventa_startDate = 'Tue, 11 Mar 2017 01:01:01 GMT'
    eventa_endDate = 'Tue, 12 Mar 2017 11:11:11 GMT'
    eventa_lat = -33.870943
    eventa_lon = 151.190311
    eventa_remFlag = False
    eventa_remTime = None
    eventa_addr = None
    eventa_shared = False
    eventa_tripID = 1

    eventx_eventID = 4
    eventx_eventName = 'EventX Name'
    eventx_startDate = datetime.strptime(
        'Tue, 13 Mar 2017 01:01:01 GMT', DT_FORMAT)
    eventx_endDate = datetime.strptime(
        'Tue, 14 Mar 2017 11:11:11 GMT', DT_FORMAT)
    eventx_lat = -33.866891
    eventx_lon = 151.200814
    eventx_remFlag = False
    eventx_remTime = None
    eventx_addr = None
    eventx_shared = False
    eventx_tripID = 1

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Add a Event and remove it so that we know that it won't exist.
        ex = Event(self.eventx_eventID, self.eventx_eventName,
                   self.eventx_startDate, self.eventx_endDate,
                   self.eventx_lat, self.eventx_lon,
                   self.eventx_remFlag, self.eventx_remTime,
                   self.eventx_addr, self.eventx_shared,
                   self.eventx_tripID)
        db.add(ex)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(ex)
        db.commit()
        db.close()

    def test_events_post(self):
        print_title('without_JSON_request')
        events_path = VER_PATH + '/events'
        rv = self.app.post(events_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_tripID')
        rv = self.app.post(events_path, data=json.dumps({}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_events')
        data = {Event.KEY__TRIPID: self.eventa_tripID}
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('non_existent_trip')
        data = {Event.KEY__TRIPID: tripx_tripID,
                'events': ''}
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('not_authorized')
        data = {Event.KEY__TRIPID: self.eventa_tripID,
                'events': ''}
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('empty_events')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        data['events'] = []
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('post_success')
        eventa_dict = {Event.KEY__ID: self.eventa_eventID,
                       Event.KEY__EVENTNAME: self.eventa_eventName,
                       Event.KEY__STARTDATE: self.eventa_startDate,
                       Event.KEY__ENDDATE: self.eventa_endDate,
                       Event.KEY__LAT: self.eventa_lat,
                       Event.KEY__LON: self.eventa_lon,
                       Event.KEY__REMFLAG: self.eventa_remFlag,
                       Event.KEY__REMTIME: self.eventa_remTime,
                       Event.KEY__ADDR: self.eventa_addr,
                       Event.KEY__SHARED: self.eventa_shared,
                       Event.KEY__TRIPID: self.eventa_tripID}
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        eventa_dict[Event.KEY__STARTDATE] = \
            datetime.strptime(eventa_dict[Event.KEY__STARTDATE],
                              DT_FORMAT).strftime(DT_FORMAT)
        eventa_dict[Event.KEY__ENDDATE] = \
            datetime.strptime(eventa_dict[Event.KEY__ENDDATE],
                              DT_FORMAT).strftime(DT_FORMAT)
        db = create_db_session()
        ev = db.query(Event).filter(
            Event.eventID == self.eventa_eventID).first()
        self.assertEqual(eventa_dict, ev.to_dict())
        db.close()

        print_title('without_eventName')
        orig_eventa_dict = {Event.KEY__ID: self.eventa_eventID,
                            Event.KEY__EVENTNAME: self.eventa_eventName,
                            Event.KEY__STARTDATE: self.eventa_startDate,
                            Event.KEY__ENDDATE: self.eventa_endDate,
                            Event.KEY__LAT: self.eventa_lat,
                            Event.KEY__LON: self.eventa_lon,
                            Event.KEY__REMFLAG: self.eventa_remFlag,
                            Event.KEY__REMTIME: self.eventa_remTime,
                            Event.KEY__ADDR: self.eventa_addr,
                            Event.KEY__SHARED: self.eventa_shared,
                            Event.KEY__TRIPID: self.eventa_tripID}
        eventa_dict = copy(orig_eventa_dict)
        eventa_dict.pop(Event.KEY__EVENTNAME)
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_startDateTime')
        eventa_dict = copy(orig_eventa_dict)
        eventa_dict.pop(Event.KEY__STARTDATE)
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('with_invalid_startDateTime')
        invalid_datetime = 'abc'
        with self.assertRaises(ValueError):
            datetime.strptime(invalid_datetime, DT_FORMAT)
        eventa_dict = copy(orig_eventa_dict)
        eventa_dict[Event.KEY__STARTDATE] = invalid_datetime
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_endDateTime')
        eventa_dict = copy(orig_eventa_dict)
        eventa_dict.pop(Event.KEY__ENDDATE)
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('with_invalid_endDateTime')
        eventa_dict = copy(orig_eventa_dict)
        eventa_dict[Event.KEY__ENDDATE] = invalid_datetime
        data['events'] = [eventa_dict]
        rv = self.app.post(events_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_events_get(self):
        print_title('without_arguments')
        events_path = VER_PATH + '/events'
        rv = self.app.get(events_path)
        print(rv.data)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('trip_not_found')
        rv = self.app.get(events_path, query_string={
            Trip.KEY__ID: tripx_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_found_but_not_authorized')
        trip1_key_dict = {Trip.KEY__ID: trip1_tripID}
        rv = self.app.get(events_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('found_own')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(events_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('found_own_but_no_events_in_trip')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        trip2_key_dict = {Trip.KEY__ID: trip2_tripID}
        rv = self.app.get(events_path, query_string=trip2_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('event_not_found')
        rv = self.app.get(events_path, query_string={
            Event.KEY__ID: self.eventx_eventID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('event_found_not_authorized')
        event1_key_dict = {Event.KEY__ID: event1_eventID}
        rv = self.app.get(events_path, query_string=event1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('event_found')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(events_path, query_string=event1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('trip_not_found')
        db = create_db_session()
        db.add(Event(self.eventx_eventID, self.eventx_eventName,
                     self.eventx_startDate, self.eventx_endDate,
                     self.eventx_lat, self.eventx_lon,
                     self.eventx_remFlag, self.eventx_remTime,
                     self.eventx_addr, self.eventx_shared,
                     tripx_tripID))
        db.commit()
        db.close()
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(events_path, query_string={
            Event.KEY__ID: self.eventx_eventID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_events_put(self):
        print_title('event_not_found')
        event_pathx = VER_PATH + '/events/' + str(self.eventx_eventID)
        rv = self.app.put(event_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('existing_trip_not_authorized')
        event_path1 = VER_PATH + '/events/' + str(event1_eventID)
        rv = self.app.put(event_path1, content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('authorized_not_json')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.put(event_path1, data=dict({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('no_changes')
        rv = self.app.put(event_path1, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('change_eventName')
        suffix = 'abc'
        data = {Event.KEY__EVENTNAME: event1_eventName + suffix}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.eventName, event1_eventName + suffix)
        db.close()

        print_title('change_startDateTime')
        data = {Event.KEY__STARTDATE: self.eventa_startDate}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.startDateTime,
                         datetime.strptime(self.eventa_startDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_startDateTime')
        with self.assertRaises(ValueError):
            datetime.strptime(suffix, DT_FORMAT)
        data = {Event.KEY__STARTDATE: suffix}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_endDateTime')
        data = {Event.KEY__ENDDATE: self.eventa_endDate}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.endDateTime,
                         datetime.strptime(self.eventa_endDate, DT_FORMAT))
        db.close()

        print_title('change_invalid_endDateTime')
        with self.assertRaises(ValueError):
            datetime.strptime(suffix, DT_FORMAT)
        data = {Event.KEY__ENDDATE: suffix}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('change_lat')
        self.assertNotEqual(event1_lat, event2_lat)
        data = {Event.KEY__LAT: event2_lat}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.lat, event2_lat)
        db.close()

        print_title('change_lon')
        self.assertNotEqual(event1_lon, event2_lon)
        data = {Event.KEY__LON: event2_lon}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.lon, event2_lon)
        db.close()

        print_title('change_eventName')
        self.assertNotEqual(event1_addr, suffix)
        data = {Event.KEY__ADDR: suffix}
        rv = self.app.put(event_path1, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        ev = db.query(Event).filter(Event.eventID == event1_eventID).first()
        self.assertEqual(ev.address, suffix)
        db.close()

        print('trip_not_found')
        db = create_db_session()
        db.add(Event(self.eventx_eventID, self.eventx_eventName,
                     self.eventx_startDate, self.eventx_endDate,
                     self.eventx_lat, self.eventx_lon,
                     self.eventx_remFlag, self.eventx_remTime,
                     self.eventx_addr, self.eventx_shared,
                     tripx_tripID))
        db.commit()
        db.close()
        rv = self.app.put(event_pathx, data=json.dumps(data),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_events_delete(self):
        print_title('not_authorized_delete')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        events_path1 = VER_PATH + '/events/' + str(event1_eventID)
        rv = self.app.delete(events_path1)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)
        db = create_db_session()
        self.assertIsNot(db.query(Event).filter(
            Event.eventID == event1_eventID).first(), None)
        db.close()

        print_title('delete_permission')
        db = create_db_session()
        db.add(Permissions(event1_eventID, PermissionsEnum('event'),
                           False, user2_username, trip1_tripID))
        db.commit()
        db.close()
        rv = self.app.delete(events_path1)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Permissions).filter(and_(
            Permissions.permissionID == event1_eventID,
            Permissions.toUser == user2_username,
            Permissions.toTrip == trip1_tripID)).first(), None)
        db.close()

        print_title('delete_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.delete(events_path1)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Event).filter(
            Event.eventID == event1_eventID).first(), None)
        db.close()


class Bookmarks(TestCase):
    bookmarka_bookmarkID = 2
    bookmarka_lat = 49.2606
    bookmarka_lon = -123.2460
    bookmarka_placeID = '30bee58f819b6c47bd24151802f25ecf11df8943'
    bookmarka_name = 'BookmarkA Name'
    bookmarka_addr = 'BookmarkA Address'
    bookmarka_type = 'BookmarkA Type'
    bookmarka_shared = False
    bookmarka_tripID = 1
    bookmarka_eventID = None

    bookmarkx_bookmarkID = 3
    bookmarkx_lat = 49.2671
    bookmarkx_lon = -122.9689
    bookmarkx_placeID = '45a27fd8d56c56dc62afc9b49e1d850440d5c403'
    bookmarkx_name = 'BookmarkX Name'
    bookmarkx_addr = 'BookmarkX Address'
    bookmarkx_type = 'BookmarkX Type'
    bookmarkx_shared = False
    bookmarkx_tripID = 1
    bookmarkx_eventID = None

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Permissions are not tested here.
        db.query(Permissions).delete()
        db.commit()
        # Add a Bookmark and remove it so that we know that it won't exist.
        bx = Bookmark(self.bookmarkx_bookmarkID, self.bookmarkx_lat,
                      self.bookmarkx_lon, self.bookmarkx_placeID,
                      self.bookmarkx_name, self.bookmarkx_addr,
                      self.bookmarkx_type, self.bookmarkx_shared,
                      self.bookmarkx_tripID, self.bookmarkx_eventID)
        db.add(bx)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(bx)
        db.commit()
        db.close()

    def test_bookmarks_post(self):
        print_title('without_JSON_request')
        bookmarks_paths = VER_PATH + '/bookmarks'
        rv = self.app.post(bookmarks_paths)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_tripID')
        rv = self.app.post(bookmarks_paths, data=json.dumps({}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_bookmarks')
        data = {Bookmark.KEY__TRIPID: self.bookmarka_tripID}
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('non_existent_trip')
        data = {Event.KEY__TRIPID: tripx_tripID,
                'bookmarks': ''}
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('not_authorized')
        data = {Bookmark.KEY__TRIPID: self.bookmarka_tripID,
                'bookmarks': ''}
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('empty_bookmarks')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        data['bookmarks'] = []
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('post_success')
        bookmarka_dict = {Bookmark.KEY__ID: self.bookmarka_bookmarkID,
                          Bookmark.KEY__LAT: self.bookmarka_lat,
                          Bookmark.KEY__LON: self.bookmarka_lon,
                          Bookmark.KEY__PLACEID: self.bookmarka_placeID,
                          Bookmark.KEY__NAME: self.bookmarka_name,
                          Bookmark.KEY__ADDR: self.bookmarka_addr,
                          Bookmark.KEY__TYPE: self.bookmarka_type,
                          Bookmark.KEY__SHARED: self.bookmarka_shared,
                          Bookmark.KEY__TRIPID: self.bookmarka_tripID,
                          Bookmark.KEY__EVENTID: self.bookmarka_eventID}
        data['bookmarks'] = [bookmarka_dict]
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        bo = db.query(Bookmark).filter(
            Bookmark.bookmarkID == self.bookmarka_bookmarkID).first()
        self.assertEqual(bookmarka_dict, bo.to_dict())
        db.close()

        print_title('test_first_post')
        db = create_db_session()
        db.query(Bookmark).delete()
        db.commit()
        db.close()
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        bookmarka_dict[Bookmark.KEY__ID] = 1
        bo = db.query(Bookmark).filter(
            Bookmark.bookmarkID == 1).first()
        self.assertEqual(bookmarka_dict, bo.to_dict())
        db.close()

        print_title('without_lat')
        orig_bookmarka_dict = {Bookmark.KEY__ID: self.bookmarka_bookmarkID,
                               Bookmark.KEY__LAT: self.bookmarka_lat,
                               Bookmark.KEY__LON: self.bookmarka_lon,
                               Bookmark.KEY__PLACEID: self.bookmarka_placeID,
                               Bookmark.KEY__NAME: self.bookmarka_name,
                               Bookmark.KEY__ADDR: self.bookmarka_addr,
                               Bookmark.KEY__TYPE: self.bookmarka_type,
                               Bookmark.KEY__SHARED: self.bookmarka_shared,
                               Bookmark.KEY__TRIPID: self.bookmarka_tripID,
                               Bookmark.KEY__EVENTID: self.bookmarka_eventID}
        bookmarka_dict = copy(orig_bookmarka_dict)
        bookmarka_dict.pop(Bookmark.KEY__LAT)
        data['bookmarks'] = [bookmarka_dict]
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_lon')
        bookmarka_dict = copy(orig_bookmarka_dict)
        bookmarka_dict.pop(Bookmark.KEY__LON)
        data['bookmarks'] = [bookmarka_dict]
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_placeID')
        bookmarka_dict = copy(orig_bookmarka_dict)
        bookmarka_dict.pop(Bookmark.KEY__PLACEID)
        data['bookmarks'] = [bookmarka_dict]
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('without_name')
        bookmarka_dict = copy(orig_bookmarka_dict)
        bookmarka_dict.pop(Bookmark.KEY__NAME)
        data['bookmarks'] = [bookmarka_dict]
        rv = self.app.post(bookmarks_paths, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

    def test_bookmarks_get(self):
        print_title('without_arguments')
        bookmarks_path = VER_PATH + '/bookmarks'
        rv = self.app.get(bookmarks_path)
        print(rv.data)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('trip_not_found')
        rv = self.app.get(bookmarks_path, query_string={
            Trip.KEY__ID: tripx_tripID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_found_but_not_authorized')
        trip1_key_dict = {Trip.KEY__ID: trip1_tripID}
        rv = self.app.get(bookmarks_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('found_own')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(bookmarks_path, query_string=trip1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('found_own_but_no_bookmarks_in_trip')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        trip2_key_dict = {Trip.KEY__ID: trip2_tripID}
        rv = self.app.get(bookmarks_path, query_string=trip2_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('bookmark_not_found')
        rv = self.app.get(bookmarks_path, query_string={
            Bookmark.KEY__ID: self.bookmarkx_bookmarkID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('bookmark_found_not_authorized')
        bookmark1_key_dict = {Bookmark.KEY__ID: bookmark1_bookmarkID}
        rv = self.app.get(bookmarks_path, query_string=bookmark1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('bookmark_found')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(bookmarks_path, query_string=bookmark1_key_dict)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        # TODO: see TODO#1

        print_title('trip_not_found')
        db = create_db_session()
        db.add(Bookmark(self.bookmarkx_bookmarkID, self.bookmarkx_lat,
                        self.bookmarkx_lon, self.bookmarkx_placeID,
                        self.bookmarkx_name, self.bookmarkx_addr,
                        self.bookmarkx_type, self.bookmarkx_shared,
                        tripx_tripID, self.bookmarkx_eventID))
        db.commit()
        db.close()
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.get(bookmarks_path, query_string={
            Bookmark.KEY__ID: self.bookmarkx_bookmarkID})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

    def test_bookmarks_delete(self):
        print_title('bookmark_not_found')
        bookmark_pathx = VER_PATH + '/bookmarks/' + str(
            self.bookmarkx_bookmarkID)
        rv = self.app.delete(bookmark_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('not_authorized_delete')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        bookmarks_path1 = VER_PATH + '/bookmarks/' + str(bookmark1_bookmarkID)
        rv = self.app.delete(bookmarks_path1)
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)
        db = create_db_session()
        self.assertIsNot(db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmark1_bookmarkID).first(), None)
        db.close()

        print_title('put_bad_request')
        rv = self.app.put(bookmarks_path1)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('delete_permission')
        db = create_db_session()
        db.add(Permissions(bookmark1_bookmarkID, PermissionsEnum('bookmark'),
                           False, user2_username, trip1_tripID))
        db.commit()
        db.close()
        rv = self.app.delete(bookmarks_path1)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Permissions).filter(
            Permissions.permissionID == bookmark1_bookmarkID).first(), None)
        db.close()

        print_title('delete_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        rv = self.app.delete(bookmarks_path1)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        self.assertIs(db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmark1_bookmarkID).first(), None)
        db.close()

        print_title('trip_not_found')
        db = create_db_session()
        db.add(Bookmark(self.bookmarka_bookmarkID, self.bookmarka_lat,
                        self.bookmarka_lon, self.bookmarka_placeID,
                        self.bookmarka_name, self.bookmarka_addr,
                        self.bookmarka_type, self.bookmarka_shared,
                        tripx_tripID, self.bookmarka_eventID))
        db.commit()
        db.close()
        bookmarks_patha = VER_PATH + '/bookmarks/' + str(
            self.bookmarka_bookmarkID)
        rv = self.app.delete(bookmarks_patha)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)


class Share(TestCase):
    perma_permissionID = 1  # Referring to event1_eventID.
    perma_type = PermissionsEnum.EVENT
    perma_writeFlag = False
    perma_toUser = user2_username
    perma_toTrip = trip2_tripID

    permx_permissionID = 2  # Referring to event2_eventID.
    permx_type = PermissionsEnum.EVENT
    permx_writeFlag = False
    permx_toUser = user2_username
    permx_toTrip = trip2_tripID

    def setUp(self):
        # Create a new test client instance.
        self.app = app.test_client()
        common_setup()
        db = create_db_session()
        # Add a Bookmark and remove it so that we know that it won't exist.
        px = Permissions(self.permx_permissionID, self.permx_type,
                         self.permx_writeFlag, self.permx_toUser,
                         self.permx_toTrip)
        db.add(px)
        db.commit()
        db.close()
        db = create_db_session()
        db.delete(px)
        db.commit()
        db.close()

    def test_share_post(self):
        print_title('without_JSON_request')
        share_path = VER_PATH + '/share'
        rv = self.app.post(share_path)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('empty_json')
        rv = self.app.post(share_path, data=json.dumps({}),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('trip_not_found')
        orig_data = {User.KEY__USERNAME: [self.perma_toUser],
                     Trip.KEY__ID: self.perma_toTrip,
                     Permissions.KEY__WRITEFLAG: self.perma_writeFlag,
                     Event.KEY__ID: self.perma_permissionID}
        data = deepcopy(orig_data)
        data[Trip.KEY__ID] = tripx_tripID
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('user_not_authorized')
        data = deepcopy(orig_data)
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('non_existent_user')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        data = deepcopy(orig_data)
        not_valid_username = 'userX'
        db = create_db_session()
        q = db.query(User).filter(User.userName == not_valid_username).first()
        self.assertIsNone(q)
        db.close()
        data[User.KEY__USERNAME].append(not_valid_username)
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('no_bookmark_or_event')
        data = deepcopy(orig_data)
        data.pop(Event.KEY__ID)
        data_with_no_id = deepcopy(data)
        rv = self.app.post(share_path, data=json.dumps(data_with_no_id),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('bookmark_not_found')
        db = create_db_session()
        q = db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmarkx_bookmarkID).first()
        self.assertIsNone(q)
        data = deepcopy(data_with_no_id)
        data[Bookmark.KEY__ID] = bookmarkx_bookmarkID
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('tripID_not_matching')
        data = deepcopy(data_with_no_id)
        data[Bookmark.KEY__ID] = bookmark1_bookmarkID
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('bookmark_shared_already')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        data = deepcopy(data_with_no_id)
        data[Trip.KEY__ID] = trip1_tripID
        data[Bookmark.KEY__ID] = bookmark1_bookmarkID
        bookmark_share_data = deepcopy(data)
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_409_CONFLICT), rv.status)

        print_title('bookmark_share_success')
        db = create_db_session()
        new_user = 'newUser'
        q = db.query(User).filter(User.userName == new_user).first()
        self.assertIsNone(q)
        db.add(User(new_user, user1_password, user1_name,
                    user1_email, user1_currency))
        new_trip = tripx_tripID + 1
        q = db.query(Trip).filter(Trip.tripID == new_trip).first()
        self.assertIsNone(q)
        db.add(Trip(new_trip, trip1_tripName, trip1_active,
                    trip1_startDate, trip1_endDate, new_user))
        db.commit()
        db.close()
        data = deepcopy(bookmark_share_data)
        data[User.KEY__USERNAME] = [new_user]
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)

        print_title('event_not_found')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        q = db.query(Event).filter(
            Event.eventID == eventx_eventID).first()
        self.assertIsNone(q)
        data = deepcopy(data_with_no_id)
        data[Event.KEY__ID] = eventx_eventID
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('tripID_not_matching')
        data = deepcopy(data_with_no_id)
        data[Event.KEY__ID] = event1_eventID
        event_share_data = deepcopy(data)
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('event_share_success')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        data = deepcopy(event_share_data)
        data[Trip.KEY__ID] = trip1_tripID
        data[Event.KEY__ID] = event2_eventID
        data[User.KEY__USERNAME] = [new_user]
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)

        print_title('event_shared_already')
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_409_CONFLICT), rv.status)

        print_title('trip_share_success')
        data.pop(Event.KEY__ID)
        data[User.KEY__USERNAME] = [new_user]
        db = create_db_session()
        db.query(Permissions).delete()
        db.commit()
        q = db.query(Permissions).filter(Permissions.toUser == new_user).all()
        self.assertFalse(q)
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)

        print_title('duplicate_trip_share')
        rv = self.app.post(share_path, data=json.dumps(data),
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_409_CONFLICT), rv.status)

    def test_share_get(self):
        print_title('without_arguments')
        share_path = VER_PATH + '/share'
        rv = self.app.get(share_path, query_string={})
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('empty_arguments')
        share_path = VER_PATH + '/share'
        rv = self.app.get(share_path, query_string={})
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('not_authorized')
        share_path = VER_PATH + '/share'
        rv = self.app.get(share_path, query_string={
            Permissions.KEY__TOUSER: user2_username})
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('no_shared_permissions')
        rv = login_helper_user1(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        q = db.query(Permissions).filter(
            Permissions.toUser == user1_username).all()
        self.assertFalse(q)
        rv = self.app.get(share_path, query_string={
            Permissions.KEY__TOUSER: user1_username})
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('shared_permissions_found')
        db = create_db_session()
        db.add(Permissions(self.perma_permissionID, self.perma_type,
                           self.perma_writeFlag, self.perma_toUser,
                           self.perma_toTrip))
        db.commit()
        db.close()
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        db = create_db_session()
        q = db.query(Permissions).filter(
            Permissions.toUser == user2_username).all()
        self.assertTrue(q)
        rv = self.app.get(share_path, query_string={
            Permissions.KEY__TOUSER: user2_username})
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('shared_permissions_found')
        db = create_db_session()
        db.query(Event).filter(
            Event.eventID == event1_eventID).delete()
        db.query(Bookmark).filter(
            Bookmark.bookmarkID == bookmark1_bookmarkID).delete()
        db.commit()
        db.close()
        rv = self.app.get(share_path, query_string={
            Permissions.KEY__TOUSER: user2_username})
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

        print_title('shared_permissions_found_without_query')
        rv = self.app.get(share_path)
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

    def test_share_put(self):
        print_title('no_type')
        share_pathx = VER_PATH + '/share/' + str(self.permx_permissionID)
        rv = self.app.put(share_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('empty_json')
        rv = self.app.put(share_pathx, data=json.dumps({}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('invalid_type')
        invalid_type = 'abc'
        with self.assertRaises(ValueError):
            PermissionsEnum(invalid_type)
        rv = self.app.put(share_pathx, data=json.dumps({
            Permissions.KEY__TYPE: invalid_type}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('share_permission_not_found')
        rv = self.app.put(share_pathx, data=json.dumps({
            Permissions.KEY__TYPE: PermissionsEnum.EVENT.value}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('share_permission_found_but_no_toTrip')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        share_path = VER_PATH + '/share/' + str(perm1b_permissionID)
        rv = self.app.put(share_path, data=json.dumps({
            Permissions.KEY__TYPE: perm1b_type.value}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_400_BAD_REQUEST), rv.status)

        print_title('share_permission_success')
        share_path = VER_PATH + '/share/' + str(perm1b_permissionID)
        rv = self.app.put(share_path, data=json.dumps({
            Permissions.KEY__TYPE: perm1b_type.value,
            Permissions.KEY__TOTRIP: trip1_tripID}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)

    def test_share_delete(self):
        print_title('delete_success_bookmark_share')
        rv = login_helper_user2(self.app)
        self.assertIn(str(HTTP_201_CREATED), rv.status)
        share_path = VER_PATH + '/share/' + str(perm1b_permissionID)
        rv = self.app.delete(share_path, data=json.dumps({
            Permissions.KEY__TYPE: perm1b_type.value}),
                          content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        q = db.query(Permissions).filter(and_(
            Permissions.permissionID == perm1b_permissionID,
            Permissions.type == perm1b_type)).first()
        self.assertIsNone(q)

        print_title('delete_success_event_share')
        db.add(Permissions(self.perma_permissionID, self.perma_type,
                           self.perma_writeFlag, self.perma_toUser,
                           self.perma_toTrip))
        db.commit()
        db.close()
        share_path = VER_PATH + '/share/' + str(self.perma_permissionID)
        rv = self.app.delete(share_path, data=json.dumps({
            Permissions.KEY__TYPE: self.perma_type.value}),
                             content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_200_OK), rv.status)
        db = create_db_session()
        q = db.query(Permissions).filter(and_(
            Permissions.permissionID == self.perma_permissionID,
            Permissions.type == self.perma_type.value)).first()
        self.assertIsNone(q)



if __name__ == '__main__':
    from __init__ import setup_dummy_data, print_database
    setup_dummy_data()
    print_database()
    main(verbosity=2)
