import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Submit from "@/pages/Submit";
import Shop from "@/pages/Shop";
import ShopSuccess from "@/pages/ShopSuccess";

function App() {
  return (
    <Switch>
      <Route path="/contact" component={Contact} />
      <Route path="/submit" component={Submit} />
      <Route path="/shop/success" component={ShopSuccess} />
      <Route path="/shop" component={Shop} />
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
