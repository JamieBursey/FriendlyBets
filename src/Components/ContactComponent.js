import { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";
import { bannerTextStyles } from "./Banner";

const backgroundGradient = {
  background: "linear-gradient(to bottom, #0B1305 60%, #1e90ff 100%)",
  borderRadius: "1rem",
};
function RenderContact() {
  const [formInput, setFormInput] = useState({
    id: "",
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onchange = (event) => {
    const { name, value } = event.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = () => {
    const adminMessages = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.ADMIN_MESSSAGES) || "[]"
    );
    const newMessage = [...adminMessages, formInput];
    localStorage.setItem(
      LOCALSTORAGE.ADMIN_MESSSAGES,
      JSON.stringify(newMessage)
    );

  };
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
                    placeholder="John"
                    className="form-control"
                    onChange={onchange}
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
                    placeholder="example@email.com"
                    className="form-control"
                    onChange={onchange}
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
                    placeholder="Some Subject"
                    className="form-control"
                    onChange={onchange}
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
                    onChange={onchange}
                  ></textarea>
                  <label>Your message</label>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center text-md-left">
            <button className="btn btn-primary" onClick={handleSubmit}>
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
              <i className="fas fa-envelope mt-4 fa-2x"></i>
              <p>example@email.com</p>
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

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const deleteMessage = (indexToDelete) => {
    const updatedMessages = messages.filter(
      (deleteMessage, index) => index !== indexToDelete
    );
    setMessages(updatedMessages);
    localStorage.setItem(
      LOCALSTORAGE.ADMIN_MESSSAGES,
      JSON.stringify(updatedMessages)
    );
  };
  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    const adminMessages = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.ADMIN_MESSSAGES) || "[]"
    );

    if (loggedInUser && loggedInUser.username === "Admin") {
      setIsAdmin(true);
      setMessages(adminMessages);
    }
  }, []);

  if (!isAdmin) {
    return;
  }
  return (
    <div>
      <div
        style={{
          borderTop: "1px solid #ccc",
          width: "100%",
          marginBottom: "10px",
        }}
      ></div>
      <div>
        <h1 className="text-center" style={bannerTextStyles}>
          Messages
        </h1>
        <div className="container bg-secondary p-2" style={backgroundGradient}>
          {messages.length > 0 ? (
            <div className="row">
              {messages.map((message, index) => (
                <div className="col-md-6" key={index}>
                  <div className="card text-center mt-1">
                    <div className="card-header text-info fw-bold">
                      {message.subject}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{message.Name}</h5>
                      <h6 className="card-subtitle mb-2 text-body-secondary">
                        {message.email}
                      </h6>
                      <p className="card-text">{message.message}</p>
                      <a href="index.html" className="btn btn-primary">
                        Home
                      </a>
                    </div>
                    <div className="card-footer text-body-secondary">
                      <a
                        href="index.html"
                        className="btn btn-outline-danger"
                        onClick={() => deleteMessage(index)}
                      >
                        Delete Message
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-center text-info mt-3">
                No messages to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export { RenderContact, AdminMessages, backgroundGradient };
