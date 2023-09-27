function Matches() {
    const backgroundColor = {
        backgroundColor: "#0B1305",
        borderRadius: "5px"
    }
    const Games = [{ home: "Colorado", vs: "VS", visitor: "Vegas" },
    { home: "Devils", vs: "VS", visitor: "Ottowa" },
    { home: "Toronto", vs: "VS", visitor: "Montreal" },
    { home: "Boston", vs: "VS", visitor: "Winnipeg" }]
    const liveGames = Games.map((Item, index) => {
        return (
            <div key={index} style={backgroundColor} className="container text-center text-light">
                <div className="row">
                    <div className="col mb-3">
                        {Item.visitor}
                    </div>
                    <div style={backgroundColor} className="col">
                        {Item.vs}
                    </div>
                    <div className="col">
                        {Item.home}
                    </div>
                </div>
            </div>)
    })
    return (
        <div style={backgroundColor} className="container text-center mt-4 text-light">
            <div className="row">
                <div className="col mb-3">
                    Visitor Team
                </div>
                <div className="col ">
                    VS
                </div>
                <div className="col">
                    Home Team
                </div>
            </div>
            {liveGames}
        </div>)

}

export default Matches