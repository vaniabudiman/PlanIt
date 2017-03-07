/*
 * API/fetch() calling structure credit: https://github.com/reactjs/redux/issues/291#issuecomment-122829159
 */

export const Types = {
    GET_CITIES_ATTEMPT: "GET_CITIES_ATTEMPT",
    GET_CITIES_SUCCESS: "GET_CITIES_SUCCESS",
    GET_CITIES_FAILED: "GET_CITIES_FAILED"
};

function getCitiesAttempt () {
    return {
        type: Types.GET_CITIES_ATTEMPT,
    };
}

//function getCitiesSuccess (response) {
//    dispatch({
//            items: response.geonames,
//            type: Types.GET_CITIES_SUCCESS,
//        });
//    };
//}

function getCitiesFailed (error) {
    return {
        error,
        type: Types.GET_CITIES_FAILED,
    };
}

export function getCities (countryCode) {
    return dispatch => {
        dispatch(getCitiesAttempt());
        fetch("http://api.geonames.org/searchJSON?country=" + countryCode + "&orderby=relevance&username=planitapp", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
//            body: JSON.stringify({
//                userName: loginData.userName,
//                password: loginData.password,
//            }),
        })
        .then(response => { // Header response.
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
//                  dispatch(getCitiesSuccess(response));
//                dispatch(loginSuccess(response));
//                alert("Login Success. Hello " + loginData.userName + "!");
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getCitiesFailed(error));
                throw error;
            }
//            return { header: response, response: response.json() };
        })
         .then(response => {
             // json response of newly created User object is here
//             getCitiesSuccess(response);
             dispatch({
                 items: response.geonames,
                 type: Types.GET_CITIES_SUCCESS,
             });
         })
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}