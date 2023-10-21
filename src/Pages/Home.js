import { Banner, Buttons, Matches } from "../Components";
import { loggedInUserKey } from "../Data";
import { useNavigate } from "react-router-dom";

function Home() {
  const checkIfLoggedInExists = localStorage.getItem(loggedInUserKey);
  const navigate = useNavigate();
  console.log("checkLogin", checkIfLoggedInExists);
  if (checkIfLoggedInExists == null) {
    navigate("/login");
    console.log("nav", navigate);
  } else
    return (
      <div>
        <Banner />
        <Buttons />
        <Matches />
      </div>
    );
}

export default Home;
