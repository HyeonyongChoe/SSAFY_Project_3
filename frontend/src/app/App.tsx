import { ModalProvider } from "./providers/ModalProvider";
import { AppRouter } from "./router";

function App() {
  return (
    <>
      <AppRouter />
      <ModalProvider />
    </>
  );
}

export default App;
