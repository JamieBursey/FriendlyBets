function buttons(buttonsData) {
    return (
        <div className="App text-bg-success p-3 mb-3">
            <div className="container text-center">
                <div className="row">
                    {buttonsData ? buttonsData.map((button, index) => (
                        <div className="col" key={index}>
                            <button type="button" className={`btn ${button.color}`}>{button.text}</button>
                        </div>)) : null}
                </div>
            </div>
        </div >)
}