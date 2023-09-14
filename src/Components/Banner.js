import logo from '../header.jpeg'

const bannerStyles = {
    width: "100%",
    height: 200,
    objectFit: "none",
    objectPosition: "center",
}

function Banner() {
    return <img className="" style={bannerStyles} src={logo} alt="logo" />
}

export default Banner;