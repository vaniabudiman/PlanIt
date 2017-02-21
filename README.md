# PlanIt


### Local FlaskSQLAlchemy server deployment:
While in the `FlaskSQLAlchemyServer/` directory, run the following command: 
```
python __init__.py
```
The server will now be up at http://localhost:4000 .


### Local ReactNative client deployment:
Have an android virtual device session running. Then, while in the root `PlanIt/` directory run the following command (for android development):
```
react-native run-android
```
The client will now start up in your android virtual device session.


### Local React Native Testing:
```
npm run test
```

### New Dependency:
If a new dependency is added, run the following command:
```
npm install
```
Or else the app won't start up properly.

*** Please run this & resolve failures before creating a PR or merging

### Local JS / JSX Linting:
```
npm run jslint
```
*** Please run this & resolve errors before creating a PR or merging

### Realm DB Testing:

You can count the number of objects initialized in the Realm DB. For example:
```
{realm.objects('Dog').length}
```