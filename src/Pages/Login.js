import { RegisteredUser } from "../Data";
const RegisterHandler = () => {
  const UserName = document.getElementById("RegisterUserName");
  const Password = document.getElementById("RegisterPassword");
  const NewUser = {
    UserName: UserName.value,
    Password: Password.value,
    Bets: [],
  };
  RegisteredUser.push(NewUser);
  console.log(RegisteredUser);
  UserName.value = "";
  Password.value = "";
};
const LoginHandler = () => {
  const UserName = document.getElementById("LoginName");
  const Password = document.getElementById("LoginPassword");
  if (!UserName) {
    console.log("user not found");
  }
  const EnteredUser = UserName.value;
  const EnteredPassword = Password.value;
  const ValidUser = RegisteredUser.some(
    (user) => user.UserName === EnteredUser && user.Password === EnteredPassword
  );
  if (ValidUser) {
    console.log("signin");
  }
};
function Login() {
  const InputStyle = {
    width: "250px",
  };
  const loginBackground = {
    backgroundColor: "#B0C4DE",
    borderRadius: "5px",
  };
  return (
    <div style={loginBackground} className="d-flex mt-4 mx-auto">
      <form className="form-signin mx-auto">
        <h2 className="form-signin-heading text-primary">Please login</h2>
        <input
          type="text"
          style={InputStyle}
          className="form-control"
          id="LoginName"
          placeholder="User Name"
          required=""
        />
        <input
          type="password"
          style={InputStyle}
          className="form-control"
          id="LoginPassword"
          placeholder="Password"
          required=""
        />
        <button
          className="btn btn-lg btn-primary btn-block"
          type="button"
          onClick={LoginHandler}
        >
          Login
        </button>
      </form>

      <form className="form-signin mx-auto">
        <h2 className="form-signin-heading text-primary">Register</h2>
        <input
          type="text"
          style={InputStyle}
          className="form-control"
          id="RegisterUserName"
          placeholder="User Name"
          required=""
        />
        <input
          type="password"
          style={InputStyle}
          className="form-control"
          id="RegisterPassword"
          placeholder="Password"
          required=""
        />

        <button
          className="btn btn-lg btn-primary btn-block"
          type="button"
          onClick={RegisterHandler}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export { Login };
