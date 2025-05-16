import { ModalProvider } from "./providers/ModalProvider";
import { AppRouter } from "./router";
import { ToastProvider } from "./providers/ToastProvider";

function App() {
  return (
    <>
      <ToastProvider>
        <AppRouter />
        <ModalProvider />
      </ToastProvider>
    </>
  );
}

export default App;
