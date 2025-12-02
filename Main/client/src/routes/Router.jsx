import AccountStatementTabs from "@/components/AccountStatementTabs/AccountStatementTabs";
import AccountSummary from "@/components/AccountSummary/AccountSummary";
import AccountTabs from "@/components/AccountTabs/AccountTabs";
import ActiveGame from "@/components/ActiveGame/ActiveGame";
import AdminSetting from "@/components/Admin Setting/AdminSetting";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
import Banking from "@/components/Banking/Banking";
import BetList from "@/components/BetList/BetList";
import BetListLive from "@/components/BetListLive/BetListLive";
import DeactiveGame from "@/components/DeactiveGame/DeactiveGame";
import HomeControl from "@/components/HomeControl/HomeControl";
import LiveGame from "@/components/LiveGame/LiveGame";
import MyAccount from "@/components/MyAccount/MyAccount";
import Profile from "@/components/Profile/Profile";
import Setting from "@/components/Setting/Setting";
import MainLayout from "@/layout/MainLayout";
import SportsLeaguesLayout from "@/layout/SportsLeaguesLayout";
import AccountStatement from "@/pages/account-statement/AccountStatement";
import ActivityLog from "@/pages/activity-log/ActivityLog";
import BalanceOverview from "@/pages/balance-overview/BalanceOverview";
import BetsHistory from "@/pages/bets-history/BetsHistory";
import CurrentBets from "@/pages/current-bets/CurrentBets";
import Casino from "@/pages/home/Casino/Casino";
import Home from "@/pages/home/Home/Home";
import Kyc from "@/pages/home/Kyc/Kyc";
import Leagues from "@/pages/home/Leagues/Leagues";
import Login from "@/pages/home/Login/Login";
import PrivacyPolicy from "@/pages/home/PrivacyPolicy/PrivacyPolicy";
import Register from "@/pages/home/Register/Register";
import ResponsibleGaming from "@/pages/home/ResponsibleGaming/ResponsibleGaming";
import RulesRegulation from "@/pages/home/RulesRegulation/RulesRegulation";
import Sports from "@/pages/home/Sports/Sports";
import TermsAndCondition from "@/pages/home/TermsAndCondition/TermsAndCondition";
import MyProfile from "@/pages/my-profile/MyProfile";
import ProfitAndLoss from "@/pages/profit-and-loss/ProfitAndLoss";
import Settings from "@/pages/setting/Settings";
import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import DemoGame from "@/pages/home/DemoGame/DemoGame";
import DashboardLayout from "@/layout/DashboardLayout";
import UsersData from "@/pages/UsersData/UsersData";
import AddGame from "@/pages/dashboard/AddGame";
import MotherAdminRoute from "./MotherAdminRoute";
import ColorControl from "@/pages/dashboard/ColorControl";
import { NotFound } from "@/pages/NotFound";
import GameApi from "@/components/GameApi/GameApi";
import LoginForm from "@/pages/LoginForm";
import PrivateRoute from "./PrivateRoute";
import Deposit from "@/pages/Deposit/Deposit";
import Withdraw from "@/pages/Withdraw/WIthdraw";
import DepositForm from "@/pages/Deposit/DepositForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/games/demo/:id",
        element: (
          <PrivateRoute>
            {" "}
            <DemoGame />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "/balance-overview",
        element: <PrivateRoute> <BalanceOverview />  </PrivateRoute>,
      },
      {
        path: "/current-bets",
        element:  <PrivateRoute> <CurrentBets /> </PrivateRoute>,
      },
      {
        path: "/account-statement",
        element: <PrivateRoute> <AccountStatement /> </PrivateRoute>,
      },
      {
        path: "/bets-history",
        element: <PrivateRoute><BetsHistory /> </PrivateRoute>,
      },
      {
        path: "/profit-loss",
        element: <PrivateRoute> <ProfitAndLoss /> </PrivateRoute>,
      },
      {
        path: "/activity-log",
        element: <PrivateRoute> <ActivityLog /> </PrivateRoute>,
      },
      {
        path: "/my-profile",
        element: <PrivateRoute><MyProfile /> </PrivateRoute>,
      },
      {
        path: "/setting",
        element: <PrivateRoute> <Settings /> </PrivateRoute>,
      },
      {
        path: "/deposit",
        element: <PrivateRoute> <Deposit /> </PrivateRoute>,
      },
      {
        path: "/withdraw",
        element: <PrivateRoute> <Withdraw /> </PrivateRoute>,
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
      { path: "/terms-conditions", element: <TermsAndCondition /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/rules-regulation", element: <RulesRegulation /> },
      { path: "/kyc", element: <Kyc /> },
      { path: "/responsible-gaming", element: <ResponsibleGaming /> },
    ],
  },
  {
    path: "/deposit/payment-method/:id",
    element: <DepositForm />,
  },
  {
    path: "/leagues",
    element: <SportsLeaguesLayout />,
    children: [
      {
        path: "",
        element: <Leagues />,
      },
    ],
  },
  {
    path: "/sports",
    element: <SportsLeaguesLayout />,
    children: [
      {
        path: "",
        element: <Sports />,
      },
    ],
  },
  {
    path: "/casino",
    element: <SportsLeaguesLayout />,
    children: [
      {
        path: "",
        element: <Casino />,
      },
    ],
  },
  {
    path: "/admindashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "generalsetting", element: <Setting /> },
      { path: "adminsetting", element: <AdminSetting /> },
      { path: "gameapi", element: <GameApi /> },
      {
        path: "homecontrol",
        element: (
          <MotherAdminRoute>
            <HomeControl />
          </MotherAdminRoute>
        ),
      },
      {
        path: "colorcontrol",
        element: (
          <MotherAdminRoute>
            <ColorControl />
          </MotherAdminRoute>
        ),
      },
      {
        path: "addgame",
        element: (
          <MotherAdminRoute>
            {" "}
            <AddGame />{" "}
          </MotherAdminRoute>
        ),
      },
      { path: "myaccount", element: <MyAccount /> },
      { path: "betlist", element: <BetList /> },
      { path: "betlive", element: <BetListLive /> },
      { path: "banking", element: <Banking /> },
      { path: "activegame", element: <ActiveGame /> },
      { path: "deactivegame", element: <DeactiveGame /> },
      { path: "livegame", element: <LiveGame /> },
      { path: "usersdata/:role", element: <UsersData /> },
    ],
  },
  {
    path: "/motheradmin",
    element: <LoginForm role="mother-admin" title="Mother Admin" />,
  },
  { path: "/admin", element: <LoginForm role="admin" title="Admin" /> },
  {
    path: "/subadmin",
    element: <LoginForm role="sub-admin" title="Sub Admin" />,
  },
  { path: "/master", element: <LoginForm role="master" title="Master" /> },
  { path: "/agent", element: <LoginForm role="agent" title="Agent" /> },
  {
    path: "/subagent",
    element: <LoginForm role="sub-agent" title="Sub Agent" />,
  },
  { path: "/accountsummary", element: <AccountSummary /> },
  { path: "/accounttabs", element: <AccountTabs /> },
  { path: "/accountstatementtabs", element: <AccountStatementTabs /> },
  { path: "/profile", element: <Profile /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
