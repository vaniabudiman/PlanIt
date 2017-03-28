# Unit testing module.
import unittest
from unittest import TestCase, main
# Flask session and response status codes.
from flask import session
from flask_api.status import *
# Json handling.
import json
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

verbose = True
app.config['TESTING'] = True


def print_data(response):
    if verbose:
        print('\t' + response.status)
        print('\t' + '\n\t'.join(wrap(str(response.data))))


def print_title(title):
    if verbose:
        print('TEST: ' + title)


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

trip1_tripID = 1
trip1_tripName = 'Trip1 Name'
trip1_active = True
trip1_startDate = datetime.strptime(
    'Tue, 01 Mar 2017 01:01:01 GMT', DT_FORMAT)
trip1_endDate = datetime.strptime(
    'Tue, 01 Mar 2017 11:11:11 GMT', DT_FORMAT)
trip1_userName = user1_username

tripx_tripID = trip1_tripID + 1

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
event1_remFlag = True
event1_remTime = None
event1_addr = None
event1_shared = None
event1_tripID = 1


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
                      event1_tripID)])
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


@unittest.skip('done')
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


@unittest.skip('done')
class Trips(TestCase):
    tripa_tripID = 2
    tripa_tripName = 'TripA Name'
    tripa_active = True
    tripa_startDate = 'Tue, 02 Mar 2017 01:01:01 GMT'
    tripa_endDate = 'Tue, 02 Mar 2017 11:11:11 GMT'
    tripa_userName = user2_username

    tripx_tripID = 3
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

@unittest.skip('done')
class Transportations(TestCase):
    transporta_transportID = 2
    transporta_type = TransportEnum('bus')
    transporta_operator = 'Transportation2Operator'
    transporta_number = '2345'
    transporta_depAddr = 'Transportation2 Departure Address'
    transporta_arrAddr = 'Transportation2 Arrival Address'
    transporta_eventID = 2
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
        db.add(Trip(trip1_tripID + 1, 'a', True,
                    trip1_startDate, trip1_endDate, trip1_userName))
        db.commit()
        db.close()
        rv = self.app.get(transport_path, query_string={
            Trip.KEY__ID: trip1_tripID + 1})
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
        db.add(Transportation(transport1_transportID + 1, transport1_type,
                              transport1_operator, transport1_number,
                              transport1_depAddr, transport1_arrAddr,
                              transport1_eventID + 1))
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
        db.add(Event(transport1_eventID + 1, event1_eventName,
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
                              transport1_eventID + 1))
        db.commit()
        db.close()
        transport_pathx = VER_PATH + '/transportation/' + str(
            self.transportx_transportID)
        rv = self.app.put(transport_pathx)
        print_data(rv)
        self.assertIn(str(HTTP_404_NOT_FOUND), rv.status)

        print_title('trip_not_found')
        db = create_db_session()
        db.add(Event(transport1_eventID + 1, event1_eventName,
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
        transport_path = VER_PATH + '/transportation/' +\
                         str(transport1_transportID)
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
        self.assertIs(db.query(Permissions).filter(
            Permissions.permissionID == event1_eventID).first(), None)
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




if __name__ == '__main__':
    main(verbosity=2)
