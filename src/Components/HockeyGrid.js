function HockeyGrid() {
    const Games = [{ home: "Colorado", vs: "VS", visitor: "Vegas" },
    { home: "Devils", vs: "VS", visitor: "Ottowa" },
    { home: "Toronto", vs: "VS", visitor: "Montreal" },
    { home: "Boston", vs: "VS", visitor: "Winnipeg" }]
    const liveGames = Games.map((Item, index) => {
        return (
            <div key={index} className="container text-center bg-dark text-light">
                <div className="row">
                    <div className="col mb-3">
                        {Item.visitor}
                    </div>
                    <div className="col bg-dark">
                        {Item.vs}
                    </div>
                    <div className="col">
                        {Item.home}
                    </div>
                </div>
            </div>)
    })
    return (
        <div className="container text-center bg-dark text-light">
            <div className="row">
                <div className="col mb-3">
                    Visitor Team
                </div>
                <div className="col bg-dark">
                    VS
                </div>
                <div className="col">
                    Home Team
                </div>
            </div>
            {liveGames}
        </div>)

}

export default HockeyGrid