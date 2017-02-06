import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Our User class:
from user_def import *

engine = create_engine(USER_DATABASE, echo=True)
 

def addDummyData():
    # create a Session
    session = sessionmaker(bind=engine)()
     
    user = User("admin","password")
    session.add(user)
     
    user = User("python","python")
    session.add(user)
     
    user = User("jumpiness","python")
    session.add(user)
     
    # commit the record the database
    session.commit()
     
    session.commit()
