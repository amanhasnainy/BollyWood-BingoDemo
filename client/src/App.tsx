import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/global/authContext";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BingoGamePage from "@/pages/bingo-game";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/bingo-game/:code" component={BingoGamePage} />
      <Route path="/bingo-game" component={BingoGamePage} />
      <Route path="/room/:code" component={BingoGamePage} />
      <Route path="/login" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
