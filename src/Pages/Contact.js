import emailjs from "emailjs-com";
emailjs.init("dX-avpAaeLmlw_1Jg");
const sendEmail = () => {
  emailjs.sendForm("Bets", "contact-form").then(
    function () {
      console.log("test");
    },
    function (error) {
      console.log("error");
    }
  );
};
function Contact() {
  return (
    <section className="text-info mb-4">
      <h2 className="h1-responsive font-weight-bold text-center my-4">
        Contact us
      </h2>

      <p className="text-center w-responsive mx-auto mb-5">
        Do you have any questions? Please do not hesitate to contact us
        directly.
      </p>

      <div className="row">
        <div className="col-md-9 mb-md-0 mb-5">
          <form id="contact-form">
            <div className="row">
              <div className="col-md-6">
                <div className="md-form mb-0">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                  />
                  <label>Your name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="md-form mb-0">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                  />
                  <label>Your email</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="md-form mb-0">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control"
                  />
                  <label className="">Subject</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="md-form">
                  <textarea
                    type="text"
                    id="message"
                    name="message"
                    rows="2"
                    className="form-control md-textarea"
                  ></textarea>
                  <label>Your message</label>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center text-md-left">
            <button className="btn btn-primary" onClick={sendEmail}>
              Send
            </button>
          </div>
          <div className="status"></div>
        </div>

        <div className="col-md-3 text-center">
          <ul className="list-unstyled mb-0">
            <li>
              <i className="fas fa-map-marker-alt fa-2x"></i>
              <p>Newfoundland</p>
            </li>

            <li>
              <i className="fas fa-phone mt-4 fa-2x"></i>
              <p>+ 709 683 2925</p>
            </li>

            <li>
              <i className="fas fa-envelope mt-4 fa-2x"></i>
              <p>Jamie4551@gmail.com</p>
            </li>
            <li>
              <i className="fa-brands fa-github"></i>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export { Contact };
