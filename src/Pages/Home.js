import { Banner, Buttons, Matches } from "../Components";

function Home() {
  //   const checkIfLoggedInExists = localStorage.getItem() // Get LoggedIser
  //   if(checkIfLoggedInExists != null && checkIfLoggedInExists == "" ){ // check if checkIfLoggedInExists doesn't exist
  //     navigate("/login"); //redirect them to the home page
  //   }

  return (
    <div>
      <Banner />
      <Buttons />
      <Matches />
    </div>
  );
}

export default Home;
