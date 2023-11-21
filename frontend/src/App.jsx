import { BrowserRouter, Routes, Route } from "react-router-dom";
//protect route components
import ProtectedRoutesComponents from "./components/ProtectedRoutesComponents";

//components
//footer and header
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
//user components
import RoutesWithUserChatComponent from "./components/user/RoutesWithUserChatComponent";

//Utilities
import ScrollToTop from './utils/ScrollToTop'


//unprotected pages
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
//protected user pages
import UserProfilePage from "./pages/user/UserProfilePage";


//protected admin pages
// protected admin pages:
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEditUserPage from "./pages/admin/AdminEditUserPage";
import AdminQueuePage from "./pages/admin/AdminQueuePage";
import AdminChatsPage from "./pages/admin/AdminChatsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminCreateQueuePage from "./pages/admin/AdminCreateQueuePage";


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <HeaderComponent />
      <Routes>
        {/* Add chat box in these route */}
        <Route element={<RoutesWithUserChatComponent />}>
          {/* unprotected routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="*" element="Page not exists 404" />

          
          {/* user protected routes */}
          <Route element={<ProtectedRoutesComponents />}>
            <Route path="/user" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* admin protected routes: */}
        <Route element={<ProtectedRoutesComponents isAdminPage={true} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/edit-user/:id" element={<AdminEditUserPage />} />
          <Route path="/admin/create-new-queue" element={<AdminCreateQueuePage />}/>
          <Route path="/admin/queue" element={<AdminQueuePage />} />
          <Route path="/admin/chats" element={<AdminChatsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
