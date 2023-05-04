import logo from './logo.svg';
import './App.css';
import Nav from './nav'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h4>Header</h4>
                <Nav/>
      </header>
        <div id={'container'}>
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
