import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  return (


    <header className="App-header">
      <div className="App text-bg-success p-3">
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
      <div class="text-bg-secondary p-3">
        <div class="container text-center">
          <div class="row">
            <div class="col">
              1 of 2
            </div>
            <div class="col">
              2 of 2
            </div>
          </div>
          <div class="row">
            <div class="col">
              1 of 3
            </div>
            <div class="col">
              2 of 3
            </div>
            <div class="col">
              3 of 3
            </div>
          </div>
        </div>
      </div>
    </header>


  );
}

export default App;
