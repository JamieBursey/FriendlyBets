
function NavBar() {
    return (<nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button className="nav-link active" aria-current="page" href="#">Home</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" href="#">Link</button>
                    </li>
                    <li className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" href="#">Action</button></li>
                            <li><button className="dropdown-item" href="#">Another action</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" href="#">Something else here</button></li>
                        </ul>
                    </li>
                </ul>
                <form className="d-flex" role="search">


                </form>
            </div>
        </div>
    </nav>)
}

export default NavBar