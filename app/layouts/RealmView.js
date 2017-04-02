import React, { Component } from "react";
import { ScrollView, View, Text, Divider } from "@shoutem/ui";
import { connect } from "react-redux";
import realm from "../../Realm/realm.js";


class RealmView extends Component {

    constructor (props) {
        super(props);
    }

    renderEvents () {
        return realm.objects("Event").map((event) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Event ID: {event.eventID}</Text>
                    <Text>Name: {event.eventName}</Text>
                    <Text>Start Time: {event.startTime}</Text>
                    <Text>End Time: {event.endTime}</Text>
                    <Text>Address: {event.address}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderBookmarks () {
        return realm.objects("Bookmark").map((bookmark) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Bookmark ID: {bookmark.bookmarkID}</Text>
                    <Text>Name: {bookmark.name}</Text>
                    <Text>Address: {bookmark.address}</Text>
                    <Text>Type: {bookmark.type}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderTrips () {
        return realm.objects("Trip").map((trip) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Trip ID: {trip.tripID}</Text>
                    <Text>Name: {trip.tripName}</Text>
                    <Text>Active: {trip.active}</Text>
                    <Text>Start Date: {JSON.stringify(trip.startDate)}</Text>
                    <Text>End Date: {JSON.stringify(trip.endDate)}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderTransportation () {
        return realm.objects("Transportation").map((transportation) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Transportation ID: {transportation.tripID}</Text>
                    <Text>Type: {transportation.type}</Text>
                    <Text>Operator: {transportation.operator ? transportation.operator : "None"}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderUsers () {
        return realm.objects("User").map((user) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text>{user.primaryKey ? user.primaryKey : ""}</Text>
                    <Text style={{ fontWeight: "bold" }}>User Name: {user.name}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderSessions () {
        return realm.objects("Session").map((session) => {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Username: {session.userName}</Text>
                    <Text>Password: {session.password}</Text>
                    <Text>Session: {session.session}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    render () {
        let bookmarks = this.renderBookmarks();
        let events = this.renderEvents();
        let trips = this.renderTrips();
        let transportationList = this.renderTransportation();
        let users = this.renderUsers();
        let sessions = this.renderSessions();
        return (
            <ScrollView>
                { sessions }
                { users }
                { trips }
                { events }
                { bookmarks }
                { transportationList }
            </ScrollView>
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        all: state // TODO: demo only; remove and do props as needed
    };
})(RealmView);
