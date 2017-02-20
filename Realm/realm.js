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
var realm = new Realm({
    schema: [{ name: "Dog", properties: { name: "string" } }]
});

realm.write(() => {
    realm.create("Dog", { name: "Rex" });
});

export default realm;