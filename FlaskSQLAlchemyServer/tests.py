# Unit testing module.
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
# Models.
from models import User

verbose = True


def print_data(response):
    if verbose:
        print('\t' + response.status)
        print('\t' + '\n\t'.join(wrap(str(response.data))))


def print_title(title):
    if verbose:
        print('TEST: ' + title)


class Users(TestCase):
    user1_username = 'user1'
    user1_password = 'user1Password'
    user1_name     = 'User1 Name'
    user1_email    = 'user1@email.com'
    user1_currency = 'ABC'

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
        print()
        app.config['TESTING'] = True
        # Create a new test client instance.
        self.app = app.test_client()
        # Empty and recreate all tables.
        base.metadata.drop_all(bind=engine)
        base.metadata.create_all(bind=engine)
        # Add users.
        db = create_db_session()
        db.add(User(self.user1_username, self.user1_password, self.user1_name,
                    self.user1_email, self.user1_currency))
        db.commit()
        # Add a user and remove it so that we know that it won't exist.
        userx = User(self.userx_username, self.userx_password, self.userx_name,
                     self.userx_email, self.userx_currency)
        db.add(userx)
        db.commit()
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
        user1 = {User.KEY__USERNAME: self.user1_username,
                 User.KEY__PASSWORD: self.user1_password}
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

        print_title("not_logged_in")
        with self.app as client:
            client.get()
            self.assertNotIn(KEY__USERNAME, session)
            self.assertNotIn(KEY__LOGGED_IN, session)

        print_title('login_success')
        data = json.dumps(user1)
        rv = self.app.post(login_path, data=data,
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_201_CREATED), rv.status)

        print_title("is_logged_in")
        with self.app as client:
            client.get()
            self.assertIn(KEY__USERNAME, session)
            self.assertEqual(session[KEY__USERNAME], self.user1_username)
            self.assertIn(KEY__LOGGED_IN, session)
            self.assertTrue(session[KEY__LOGGED_IN])

        print_title('login_wrong_password')
        data = json.dumps({User.KEY__USERNAME: self.user1_username,
                           User.KEY__PASSWORD: self.user1_password + 'a'})
        rv = self.app.post(login_path, data=data,
                           content_type='application/json')
        print_data(rv)
        self.assertIn(str(HTTP_401_UNAUTHORIZED), rv.status)

        print_title('login_wrong_username')
        data = json.dumps({User.KEY__USERNAME: self.user1_username + 'a',
                           User.KEY__PASSWORD: self.user1_password})
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


if __name__ == '__main__':
    main(verbosity=2)
