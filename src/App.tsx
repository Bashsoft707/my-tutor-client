import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, MainPage, SignupPage } from "./pages";

function App() {
  return (
    <div className="min-h-full h-screen">
      <div className="max-w-md w-full space-y-8">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

// const AuthLayout = () => (
//   <AuthContextProvider>
//     <Outlet />
//     <ApiErrorWatcher />
//   </AuthContextProvider>
// );

// export const router = createBrowserRouter([
//   {
//     path: 'register',
//     element: <Registration />,
//   },
//   {
//     path: 'forgot-password',
//     element: <RequestPasswordReset />,
//   },
//   {
//     path: 'reset-password',
//     element: <ResetPassword />,
//   },
//   {
//     element: <AuthLayout />,
//     children: [
//       {
//         path: 'login',
//         element: <Login />,
//       },
//       {
//         path: '/',
//         element: <Root />,
//         children: [
//           {
//             index: true,
//             element: <Navigate to="/c/new" replace={true} />,
//           },
//           {
//             path: 'c/:conversationId?',
//             element: <ChatRoute />,
//           },
//           {
//             path: 'chat/:conversationId?',
//             element: <Chat />,
//           },
//           {
//             path: 'a/:conversationId?',
//             element: <AssistantsRoute />,
//           },
//           {
//             path: 'search/:query?',
//             element: <Search />,
//           },
//         ],
//       },
//     ],
//   },
// ]);