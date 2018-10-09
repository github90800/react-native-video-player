
export const toggleLogin = () => (dispatch) => {
    dispatch({
        type: 'TOGGLE_LOGIN_STATE'
    })
};

export const updateUser = (user) => (dispatch) => {
    dispatch({
        type: 'UDPATE_USER',
        payload: user
    })
};

export const fetchUsers = () => async (dispatch, getState, api) => {

    await api.get("https://randomuser.me/api/?results=20&inc=email,name,phone,picture").then(response => {
        console.log(response)
        dispatch({
            type: "FETCH_USERS",
            payload: response.data
        })
    }).catch((err) => {
        console.log('error', err);
    })
};

export const fetchUser = (id) => async (dispatch, getState, api) => {

    await api.get("https://randomuser.me/api/?inc=email,name,phone,picture&id="+id).then(response => {
        console.log(response)
        dispatch({
            type: "FETCH_USER",
            payload: response.data
        })
    }).catch((err) => {
        console.log('error', err);
    })
};
