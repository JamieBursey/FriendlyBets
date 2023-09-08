import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  return (


    <header className="App-header">
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
            <div class="col">
              <button type="button" class="btn btn-primary btn-lg">Invite Player</button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-primary btn-lg">Remove Player</button>
            </div>
          </div>
          <div class="row">
            <div class="col">
              Player 1
            </div>
            <div class="col">
              Player 2
            </div>
            <div class="col">
              Player 3
            </div>
          </div>
        </div>
      </div>
    </header>


  );
}

export default App;
