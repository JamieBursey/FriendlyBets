import { RegisteredUser } from "../Data";
const RegisterHandler = () => {
  const UserName = document.getElementById("RegisterUserName").value;
  const Password = document.getElementById("RegisterPassword").value;
  const NewUser = { UserName, Password };
  RegisteredUser.push(NewUser);
  console.log(RegisteredUser);
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
          name="username"
          placeholder="User Name"
          required=""
        />
        <input
          type="password"
          style={InputStyle}
          className="form-control"
          name="password"
          placeholder="Password"
          required=""
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
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
