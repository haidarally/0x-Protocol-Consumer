import logo from "./logo.svg";
import "./App.scss";
import CreateLimitOrder from "./components/CreateLimitOrder";
import Rebasing from "./components/Rebasing";
import BuyToken from "./components/BuyToken";

function App() {
  return (
    <div className="App">
      <CreateLimitOrder className="Component1" />
      <Rebasing className="Component2" />
      <BuyToken className="Component1" />
    </div>
  );
}

export default App;
