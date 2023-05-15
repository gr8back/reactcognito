import "./App.css";
import Nav from "./nav";

function App() {
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
          <div id={"flybox"}>Let's make something great!</div>
        </div>
      </div>
    </div>
  );
}

export default App;
