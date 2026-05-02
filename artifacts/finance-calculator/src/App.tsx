import { Router as WouterRouter, Switch, Route } from "wouter";
import { ThemeProvider } from "@/features/preferences/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import HomePage from "@/pages/home";
import CalculatorPage from "@/pages/calculator";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/calculators/:slug" component={CalculatorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ThemeProvider>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navbar />
        <Router />
      </ThemeProvider>
    </WouterRouter>
  );
}

export default App;
