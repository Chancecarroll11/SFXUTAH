import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Submit from "@/pages/Submit";

function App() {
  return (
    <Switch>
      <Route path="/contact" component={Contact} />
      <Route path="/submit" component={Submit} />
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
