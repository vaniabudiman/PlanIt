import Realm from "realm";


/*
 * TODO:
 *  I'm not entirely sure how Realm works and if separating it out like this is correct.
 *
 *  It seems like the Realm database creation & initialization should exist in one place?
 *
 *  The schemas (as we get more & they become more complex/longer) should probably each live in their own file as well.
 *  Then, we just import them into here for initialization?
 *
 *  Can "new Realm(...)" be called more than once? Or is it the call that just creates the local database?
 *  And is it correct if the database & its schemas are created each time the app starts up?
*/

const TripSchema = {
	name: 'Trip',
	primaryKey: 'tripID',
	properties: {
		tripID: 'int', // auto-increment id not supported in realm
		tripName: 'string',
		active: 'bool',
		startDate: {type: 'date', optional: true}, // js Date objects also contain time
		endDate: {type: 'date', optional: true},
		bookmarks: {type: 'list', objectType: 'Bookmark'},
		events: {type: 'list', objectType: 'Event'}
	}
}

const BookmarkSchema = {
	name: 'Bookmark',
	primaryKey: 'bookmarkID',
	properties: {
		bookmarkID: 'int',
		locationID: 'int', // do we want to change this to something that would be more useful for offline use? address?
		sharedWith: {type: 'list', objectType: 'User'},
		sharedFrom: 'User',
		event: 'Event'
	}
}

const EventSchema = {
	name: 'Event',
	primaryKey: 'eventID',
	properties: {
		eventID: 'int',
		eventName: 'string',
		startDateTime: 'date',
		endDateTime: 'date',
		locationID: {type: 'int', optional: true}, // do we want to change this to something that would be more useful for offline use? address?
		reminderFlag: 'bool',
		reminderTime: {type: 'date', optional: true},
		sharedWith: {type: 'list', objectType: 'User'},
		sharedFrom: 'User'
	}
}

const TransportationSchema = {
	name: 'Transportation',
	primaryKey: 'transportationID',
	properties: {
		transportationID: 'int',
		type: 'string',
		operator: {type: 'string', optional: true},
		number: {type: 'string', optional: true},
		arrivalLocationID: {type: 'int', optional: true},
		event: 'Event'
	}
}

const UserSchema = {
	name: 'User',
	primaryKey: 'userName',
	properties: {
		userName: 'string',
		name: 'string'
	}
}

const CurrencySchema = {
	name: 'Currency',
	primaryKey: 'currencyExchange', // realm doesn't support composite primary keys - storing combined value of sourceCode and resultCode as pk
	properties: {
		currencyExchange: 'string', // format of composite key is 'XXXYYY' where 'XXX' is the sourceCode and 'YYY' is the resultCode
		lastUpdated: 'date',
		sourceCode: 'string',
		resultCode: 'string',
		exchangeRate: 'double'
	}
}

var realm = new Realm({
    schema: [TripSchema, BookmarkSchema, EventSchema, TransportationSchema, UserSchema, CurrencySchema]
});

realm.write(() => {
    realm.create("Trip", { tripID: 1, tripName: 'Test Trip', active: false }, true); // 3rd arg (true) updates existing DB record w/ pk
});

export default realm;