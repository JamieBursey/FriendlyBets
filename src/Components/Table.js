function Table() {
    return <div className="p-3 mt-3"> <table className="table table-dark">
        <thead>
            <tr>
                <th scope="col">Team</th>
                <th scope="col">Athlete</th>
                <th scope="col">Bet</th>
                <th scope="col">Handle</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row" className="text">Col</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
            <tr>
                <th scope="row" className='text-danger'>NJD</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row" className='text-info'>TML</th>
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </table></div>
}

export default Table;