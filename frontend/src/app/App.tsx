import { AppRouter } from "./router";
import { ToastProvider } from "./providers/ToastProvider";

function App() {
  return (
    <>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </>
  );
}

export default App;
