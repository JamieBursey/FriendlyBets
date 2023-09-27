
const getAllFriends = () => {

    return [{ username: "Jamie", password: "" }, { username: "Kelly", password: "" },
    { username: "Paul", password: "" }, { username: "Danyelle", password: "" }, { username: "Dawson", password: "" }]
}


const getFriend = (username) => {
    return { username: "", password: "" }
}

const setFriend = (username, password) => {
    return { "username": username, "password": password }
}
const renderFriends = () => {
    return getAllFriends().map((player) => (
        <div key={player["username"]} className="col fs-4 text-danger ">
            {player["username"]}
        </div>
    ));
};
export {
    getAllFriends, getFriend, setFriend, renderFriends
}

