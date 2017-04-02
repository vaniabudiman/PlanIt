import Realm from "realm";


const TripSchema = {
    name: "Trip",
    primaryKey: "tripID",
    properties: {
        tripID: "int", // auto-increment id not supported in realm
        tripName: "string",
        active: "bool",
        startDate: "date", // js Date objects also contain time
        endDate: "date",
        bookmarks: { type: "list", objectType: "Bookmark" },
        events: { type: "list", objectType: "Event" }
    }
};

const BookmarkSchema = {
    name: "Bookmark",
    primaryKey: "bookmarkID",
    properties: {
        bookmarkID: "int",
        sharedWith: { type: "list", objectType: "User" },
        sharedFrom: "User",
        event: "Event",
        name: "string",
        address: { type: "string", optional: true },
        type: { type: "string", optional: true },
    }
};

const EventSchema = {
    name: "Event",
    primaryKey: "eventID",
    properties: {
        eventID: "int",
        eventName: "string",
        startDateTime: "date",
        endDateTime: "date",
        reminderFlag: "bool",
        reminderTime: { type: "date", optional: true },
        sharedWith: { type: "list", objectType: "User" },
        sharedFrom: "User",
        address: { type: "string", optional: true },
    }
};

const TransportationSchema = {
    name: "Transportation",
    primaryKey: "transportationID",
    properties: {
        transportationID: "int",
        type: "string",
        operator: { type: "string", optional: true },
        number: { type: "string", optional: true },
        event: "Event"
    }
};

const UserSchema = {
    name: "User",
    primaryKey: "userName",
    properties: {
        userName: "string",
        name: "string"
    }
};

const CurrencySchema = {
    name: "Currency",
    primaryKey: "currencyExchange", // realm doesn"t support composite primary keys - storing combined value of sourceCode and resultCode as pk
    properties: {
        currencyExchange: "string", // format of composite key is "XXXYYY" where "XXX" is the sourceCode and "YYY" is the resultCode
        lastUpdated: "date",
        sourceCode: "string",
        resultCode: "string",
        exchangeRate: "double"
    }
};

const SessionSchema = {
    name: "Session",
    primaryKey: "userName",
    properties: {
        userName: "string",
        password: "string",
        session: "bool"
    }
};

Realm.clearTestState() // deletes all existing realm files

var realm = new Realm({
    schema: [TripSchema, BookmarkSchema, EventSchema, TransportationSchema, UserSchema, CurrencySchema, SessionSchema]
});


// Commented out code below is for testing purposes
// May delete later, but I am leaving it alone for now

// Populating Realm w/ fake data - remove when finished using
//realm.write(() => {
//    // Creating 4 users
//    let users = [];
//    for (let i = 0; i < 4; i+=1) {
//        let userNames = ["sguo", "nkwok", "vbudiman", "nmartin"];
//        let names = ["Sisi", "Nixon", "Vania", "Nikki"];
//        let user = realm.create("User", {
//            userName: userNames[i],
//            name: names[i]
//        }, true); // 3rd arg (true) updates existing DB record w/ pk
//        users.push(user);
//    }

    // Creating 10 trips
//    let trips = [];
//    for (let i = 1; i <=10; i+=1) {
//        let trip = realm.create("Trip", {
//            tripID: i,
//            tripName: "Test Trip" + i,
//            active: false,
//            startDate: new Date(),
//            endDate: new Date()
//        }, true);
//        trips.push(trip);
//    }

    // Creating 10 custom (no bookmark, no transportation) events
//    for (let i = 1; i <=10; i+=1) {
//        let event = realm.create("Event", {
//            eventID: i,
//            eventName: "Custom Event " + i,
//            startDateTime: new Date(),
//            endDateTime: new Date(),
//            reminderFlag: false,
//            sharedFrom: users[0],
//            sharedWith: [users[1], users[2], users[3]],
//            address: "Event Address 1234 " + i,
//        }, true);
//
//        trips[i-1].events.push(event);
//    }

    // Creating 10 bookmarks (w/ corresponding event)
//    for (let i = 1; i <=10; i+=1) {
//        let bookmark = realm.create("Bookmark", {
//            bookmarkID: i,
//            active: false,
//            name: "Bookmark Name " + i,
//            address: "Bookmark Address " + i,
//            type: "Bookmark Type " + i,
//            event: {
//                eventID: i + 10,
//                eventName: "Bookmark Event " + i,
//                startDateTime: new Date(),
//                endDateTime: new Date(),
//                reminderFlag: false,
//            }
//        }, true);
//
//        trips[i-1].bookmarks.push(bookmark);
//        trips[i-1].events.push(bookmark.event);
//    }

    // Creating 10 transportation (w/ corresponding event)
//    for (let i = 1; i <=10; i+=1) {
//        let transportation = realm.create("Transportation", {
//            transportationID: i,
//            type: "plane",
//            event: {
//                eventID: i + 20,
//                eventName: "Transportation Event " + i,
//                startDateTime: new Date(),
//                endDateTime: new Date(),
//                reminderFlag: false
//            }
//        }, true);
//
//        trips[i-1].events.push(transportation.event);
//    }

//});



export default realm;