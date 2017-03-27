import "react-native";
import Reducer, { getDefaultUserData } from "../../app/reducers/accountReducer.js";
import Actions from "../../app/actions/accountActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";


describe("Account Reducer", function () {
    let user = {
        userName: "me",
        password: "pass",
        name: "test",
        email: "me@test.com",
        homeCurrency: "CAD"
    };

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("getDefaultUserData", function () {
        it("creates default user data", function () {
            let userData = getDefaultUserData();
            expect(userData).toEqual([
                { id: 1, title: "Username", placeholder: "placeholder 1", value: "", readOnly: true },
                { id: 2, title: "Password", placeholder: "placeholder 2", value: "" },
                { id: 3, title: "Name", placeholder: "placeholder 3", value: "" },
                { id: 4, title: "Email", placeholder: "placeholder 4", value: "" },
                { id: 5, title: "Home Currency", placeholder: "placeholder 5", value: "" }
            ]);
        });

        it("creates custom user data that overrides defaults", function () {
            let userData = getDefaultUserData(user.userName, user.password, user.name, user.email, user.homeCurrency);
            expect(userData).toEqual([
                { id: 1, title: "Username", placeholder: "placeholder 1", value: user.userName, readOnly: true },
                { id: 2, title: "Password", placeholder: "placeholder 2", value: user.password },
                { id: 3, title: "Name", placeholder: "placeholder 3", value: user.name },
                { id: 4, title: "Email", placeholder: "placeholder 4", value: user.email },
                { id: 5, title: "Home Currency", placeholder: "placeholder 5", value: user.homeCurrency }
            ]);
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.loginStatus).toBe("");
        expect(initial.signupStatus).toBe("");
        expect(initial.getUserStatus).toBe("");
        expect(initial.putUserStatus).toBe("");
        expect(initial.userData).toEqual(getDefaultUserData());
    });

    it("sets login attempt status", function () {
        let next = Reducer(getInitialState(), Actions.loginAttempt());
        expect(next.loginStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets login success status", function () {
        let next = Reducer(getInitialState(), Actions.loginSuccess());
        expect(next.loginStatus).toBe(FETCH_STATUS.SUCCESS);
    });

    it("sets login failed status", function () {
        let next = Reducer(getInitialState(), Actions.loginFailed());
        expect(next.loginStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets signup attempt status", function () {
        let next = Reducer(getInitialState(), Actions.signupAttempt());
        expect(next.signupStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets signup success status", function () {
        let next = Reducer(getInitialState(), Actions.signupSuccess());
        expect(next.signupStatus).toBe(FETCH_STATUS.SUCCESS);
    });

    it("sets signup failed status", function () {
        let next = Reducer(getInitialState(), Actions.signupFailed());
        expect(next.signupStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets getUser attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getUserAttempt());
        expect(next.getUserStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets getUser success status & fetched user's userData", function () {
        let next = Reducer(getInitialState(), Actions.getUserSuccess({ user: user }));
        expect(next.getUserStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.userData).toEqual(
            getDefaultUserData(user.userName, user.password, user.name, user.email, user.homeCurrency)
        );
    });

    it("sets getUser failed status", function () {
        let next = Reducer(getInitialState(), Actions.getUserFailed());
        expect(next.getUserStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets putUser attempt status", function () {
        let next = Reducer(getInitialState(), Actions.putUserAttempt());
        expect(next.putUserStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets putUSer success status & fetched user's updated userData", function () {
        let next = Reducer(getInitialState(), Actions.putUserSuccess({ user: user }));
        expect(next.putUserStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.userData).toEqual(
            getDefaultUserData(user.userName, user.password, user.name, user.email, user.homeCurrency)
        );
    });

    it("sets putUser failed status", function () {
        let next = Reducer(getInitialState(), Actions.putUserFailed());
        expect(next.putUserStatus).toBe(FETCH_STATUS.FAILED);
    });
});