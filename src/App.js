import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  return (

    <>
      <header className="App-header">
        <div class="text-center fs-1 text-success text-bg-dark p-3">Friendly Bets</div>
        <div className="App text-bg-success p-3 mb-3">
          <div class="container text-center">
            <div class="row">
              <div class="col">
                <button type="button" class="btn btn-danger">Fighting</button>
              </div>
              <div class="col">
                <button type="button" class="btn btn-primary">Hockey</button>
              </div>
              <div class="col">
                <button type="button" class="btn btn-warning">Basketball</button>
              </div>
            </div>
          </div>
        </div>
        <div class="App text-bg-success p-3">
          <div class="container text-center">
            <div class="row">
              <div class="col mb-3">
                <button type="button" class="btn btn-primary btn-lg">Invite Player</button>
              </div>
              <div class="col">
                <button type="button" class="btn btn-primary btn-lg">Remove Player</button>
              </div>
            </div>
            <div class="row">
              <div class="col fs-4">
                Player 1
              </div>
              <div class="col fs-4">
                Player 2
              </div>
              <div class="col fs-4">
                Player 3
              </div>
            </div>
          </div>
        </div>
      </header>
      <body>
        <div class="container-xl text-bg-success p-3 mt-3">
          <table class="table">
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
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </>
  );
}

export default App;
