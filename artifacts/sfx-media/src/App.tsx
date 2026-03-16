import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";

function App() {
  return (
    <Switch>
      <Route path="/contact" component={Contact} />
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
