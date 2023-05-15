import "./App.css";
import Nav from "./nav";
import {region, newvar, REACT_APP_TEST_VAR} from './myvars'

function App() {
    console.log("test var " + REACT_APP_TEST_VAR)
  return (
    <div className="App">
      <header className="App-header">
        <Nav />
        <h4>Put Your Header Here</h4>
      </header>
      <div id={"container"}>
        <div id={"subcontainer"}>
          <div>Your Content</div>
          <div>Ideas!</div>
          <div>Ideas!!!</div>
          <div>Ideas!!!!</div>
          <div id={"flybox"}/>
        </div>
      </div>
    </div>
  );
}

export default App;
