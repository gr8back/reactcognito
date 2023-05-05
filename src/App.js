import logo from './logo.svg';
import './App.css';
import Nav from './nav'
import $ from "jquery";

function App() {


  return (
    <div className="App">
      <header className="App-header">
                          <Nav/>
        <h4>Header</h4>

      </header>
        <div id={'container'} >
            <div id={'subcontainer'}>
            <div>Your Content</div>
            <div>Ideas</div>
            <div>Ideas</div>
            <div>Ideas</div>
            <div>Ideas</div>

                </div>
        </div>
    </div>
  );
}

export default App;
