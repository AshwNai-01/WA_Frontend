import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes";
import { AuthProvider } from "./modules/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
