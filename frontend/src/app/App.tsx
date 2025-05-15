<<<<<<< HEAD
// src/App.tsx
=======
import { ModalProvider } from "./providers/ModalProvider";
>>>>>>> fc207f268e5d90bbb99f2d88b7dbae08a5f6ce66
import { AppRouter } from "./router";
import { ToastProvider } from "./providers/ToastProvider";

<<<<<<< HEAD
export default function App() {
  return <AppRouter />;
=======
function App() {
  return (
    <>
      <ToastProvider>
        <AppRouter />
        <ModalProvider />
      </ToastProvider>
    </>
  );
>>>>>>> fc207f268e5d90bbb99f2d88b7dbae08a5f6ce66
}
