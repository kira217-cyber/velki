import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../RootLayout/RootLayout";
import AccountSummary from "../pages/AccountSummary/AccountSummary";
import Banking from "../pages/Banking/Banking";
import Master from "../pages/Master/Master";
import MotherAdmin from "../pages/MotherAdmin/MotherAdmin";
import SubAdmin from "../pages/SubAdmin/SubAdmin";
import BetList from "../pages/BetList/BetList";
import SubAgent from "../pages/SubAgent/SubAgent";
import Profile from "../pages/Profile/Profile";
import Agent from "../pages/Agent/Agent";
import AccountStatement from "../pages/AccountStatement/AccountStatement";
import ActiveLog from "../pages/ActiveLog/ActiveLog";
import LiveBet from "../pages/LiveBet/LiveBet";
import ProfitLossReportByDownLine from "../pages/Reports/ProfitLossReportByDownLine";
import ProfitLossReportByParlayDownLine from "../pages/Reports/ProfitLossReportByParlayDownLine";
import SummaryProfitLossReport from "../pages/Reports/SummaryProfitLossReport";
import ProfitLossReportByMarket from "../pages/Reports/ProfitLossReportByMarket";
import ProfitLossReportByPlayer from "../pages/Reports/ProfitLossReportByPlayer";
import ProfitLossReportByAllCasino from "../pages/Reports/ProfitLossReportByAllCasino";
import ProfitLossReportByCasinoDownLine from "../pages/Reports/ProfitLossReportByCasinoDownLine";
import SpinHistory from "../pages/Reports/SpinHistory";
import PendingSpinUsers from "../pages/Reports/PendingSpinUsers";
import RiskManagement from "../pages/Managements/RiskManagement";
import MM from "../pages/Managements/MM";
import Settings from "../pages/Managements/Settings";
import PSettings from "../pages/Managements/PSettings";
import Ticker from "../pages/Managements/Ticker";
import PopTicker from "../pages/Managements/PopTicker";
import Social from "../pages/Managements/Social";
import UploadBanner from "../pages/Managements/UploadBanner";
import MotherAdminRoute from "../routes/MotherAdminRoute";
import MotherAdminLogin from "../pages/Logins/MotherAdminLogin/MotherAdminLogin";
import CreatedAdminList from "../pages/AllAdminList/CreatedAdminList/CreatedAdminList";
import Users from "../pages/Users/User";
import SubAdminPrivetRoute from "../routes/SubAdminPrivetRoute";
import MasterPrivetRoute from "../routes/MasterPrivetRoute";
import AgentPrivetRoute from "../routes/AgentPrivetRoute";
import SubAgentPrivetRoute from "../routes/SubAgentPrivetRoute";
import HomeControl from "../pages/HomeControl/HomeControl";
import ColorControl from "../pages/ColorControl/ColorControl";
import GeneralSetting from "../pages/GeneralSetting/GeneralSetting";
import DepositRequest from "../pages/DepositRequst/DepositRequst";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";
import WithdrawRequest from "../pages/WithdrawRequest/WithdrawRequest";
import OthersAdminLogin from "../pages/Logins/OthersAdminLogin/OthersAdminLogin";
import AddCategories from "../pages/GameSettings/AddCategories";
import AddGame from "../pages/GameSettings/AddGame";


export const routes = createBrowserRouter([
  {
    path: "/ma",
    element: (
      <MotherAdminRoute>
        {" "}
        <RootLayout />{" "}
      </MotherAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "account-summary",
        element: <AccountSummary />,
      },
      {
        path: "banking",
        element: <Banking />,
      },
      {
        path: "master",
        element: <Master></Master>,
      },
      {
        path: "mother-admin",
        element: (
          <MotherAdminRoute>
            <MotherAdmin></MotherAdmin>
          </MotherAdminRoute>
        ),
      },
      {
        path: "home-control",
        element: (
          <MotherAdminRoute>
            <HomeControl></HomeControl>
          </MotherAdminRoute>
        ),
      },
      {
        path: "color-control",
        element: (
          <MotherAdminRoute>
            <ColorControl></ColorControl>
          </MotherAdminRoute>
        ),
      },
      {
        path: "general-setting",
        element: (
          <MotherAdminRoute>
            <GeneralSetting></GeneralSetting>
          </MotherAdminRoute>
        ),
      },
       {
        path: "deposit-request",
        element: (
          <MotherAdminRoute>
            <DepositRequest></DepositRequest>
          </MotherAdminRoute>
        ),
      },
      {
        path: "withdraw-request",
        element: (
          <MotherAdminRoute>
            <WithdrawRequest></WithdrawRequest>
          </MotherAdminRoute>
        ),
      },
      {
        path: "add-categories",
        element: (
          <MotherAdminRoute>
            <AddCategories></AddCategories>
          </MotherAdminRoute>
        ),
      },
        {
        path: "add-game",
        element: (
          <MotherAdminRoute>
            <AddGame></AddGame>
          </MotherAdminRoute>
        ),
      },
      {
        path: "transaction-history",
        element: (
          <MotherAdminRoute>
            <TransactionHistory></TransactionHistory>
          </MotherAdminRoute>
        ),
      },
      {
        path: "created-admins/:creatorId",
        element: <CreatedAdminList></CreatedAdminList>,
      },
      {
        path: "sub-admin",
        element: <SubAdmin></SubAdmin>,
      },
      {
        path: "agent",
        element: <Agent></Agent>,
      },
      {
        path: "bet-list",
        element: <BetList></BetList>,
      },
      {
        path: "sub-agent",
        element: <SubAgent></SubAgent>,
      },
      {
        path: "users",
        element: <Users></Users>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "account-statement",
        element: <AccountStatement></AccountStatement>,
      },
      {
        path: "active-log",
        element: <ActiveLog></ActiveLog>,
      },
      {
        path: "live-bet",
        element: <LiveBet></LiveBet>,
      },

      {
        path: "my-report-pnl-downline",
        element: <ProfitLossReportByDownLine></ProfitLossReportByDownLine>,
      },
      {
        path: "my-report-parlay-downline",
        element: (
          <ProfitLossReportByParlayDownLine></ProfitLossReportByParlayDownLine>
        ),
      },
      {
        path: "my-report-summary-pnl",
        element: <SummaryProfitLossReport></SummaryProfitLossReport>,
      },
      {
        path: "my-report-pl-market",
        element: <ProfitLossReportByMarket></ProfitLossReportByMarket>,
      },
      {
        path: "my-report-pl-player",
        element: <ProfitLossReportByPlayer></ProfitLossReportByPlayer>,
      },
      {
        path: "my-report-pl-casino",
        element: <ProfitLossReportByAllCasino></ProfitLossReportByAllCasino>,
      },
      {
        path: "my-report-pnl-casino-downline",
        element: (
          <ProfitLossReportByCasinoDownLine></ProfitLossReportByCasinoDownLine>
        ),
      },
      {
        path: "my-report-spin",
        element: <SpinHistory></SpinHistory>,
      },
      {
        path: "my-report-spinList",
        element: <PendingSpinUsers></PendingSpinUsers>,
      },
      {
        path: "risk-management",
        element: <RiskManagement></RiskManagement>,
      },
      {
        path: "mm",
        element: <MM></MM>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "p-settings",
        element: <PSettings></PSettings>,
      },
      {
        path: "ticker",
        element: <Ticker></Ticker>,
      },
      {
        path: "pop-ticker",
        element: <PopTicker></PopTicker>,
      },
      {
        path: "social",
        element: <Social></Social>,
      },
      {
        path: "upload-banner",
        element: <UploadBanner></UploadBanner>,
      },
    ],
  },
  {
    path: "ag",
    element: <MotherAdminLogin></MotherAdminLogin>,
  },
  {
    path: "ad",
    element: <OthersAdminLogin></OthersAdminLogin>,
  },
  {
    path: "/sa",
    element: (
      <SubAdminPrivetRoute>
        {" "}
        <RootLayout />{" "}
      </SubAdminPrivetRoute>
    ),
    children: [
      {
        path: "sub-admin",
        element: (
          <SubAdminPrivetRoute>
            <SubAdmin></SubAdmin>
          </SubAdminPrivetRoute>
        ),
      },
      {
        path: "account-summary",
        element: <AccountSummary />,
      },
      {
        path: "banking",
        element: <Banking />,
      },
      {
        path: "master",
        element: <Master></Master>,
      },
      {
        path: "created-admins/:creatorId",
        element: <CreatedAdminList></CreatedAdminList>,
      },
      {
        path: "agent",
        element: <Agent></Agent>,
      },
      {
        path: "bet-list",
        element: <BetList></BetList>,
      },
      {
        path: "sub-agent",
        element: <SubAgent></SubAgent>,
      },
      {
        path: "users",
        element: <Users></Users>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "account-statement",
        element: <AccountStatement></AccountStatement>,
      },
      {
        path: "active-log",
        element: <ActiveLog></ActiveLog>,
      },
      {
        path: "live-bet",
        element: <LiveBet></LiveBet>,
      },

      {
        path: "my-report-pnl-downline",
        element: <ProfitLossReportByDownLine></ProfitLossReportByDownLine>,
      },
      {
        path: "my-report-parlay-downline",
        element: (
          <ProfitLossReportByParlayDownLine></ProfitLossReportByParlayDownLine>
        ),
      },
      {
        path: "my-report-summary-pnl",
        element: <SummaryProfitLossReport></SummaryProfitLossReport>,
      },
      {
        path: "my-report-pl-market",
        element: <ProfitLossReportByMarket></ProfitLossReportByMarket>,
      },
      {
        path: "my-report-pl-player",
        element: <ProfitLossReportByPlayer></ProfitLossReportByPlayer>,
      },
      {
        path: "my-report-pl-casino",
        element: <ProfitLossReportByAllCasino></ProfitLossReportByAllCasino>,
      },
      {
        path: "my-report-pnl-casino-downline",
        element: (
          <ProfitLossReportByCasinoDownLine></ProfitLossReportByCasinoDownLine>
        ),
      },
      {
        path: "my-report-spin",
        element: <SpinHistory></SpinHistory>,
      },
      {
        path: "my-report-spinList",
        element: <PendingSpinUsers></PendingSpinUsers>,
      },
      {
        path: "risk-management",
        element: <RiskManagement></RiskManagement>,
      },
      {
        path: "mm",
        element: <MM></MM>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "p-settings",
        element: <PSettings></PSettings>,
      },
      {
        path: "ticker",
        element: <Ticker></Ticker>,
      },
      {
        path: "pop-ticker",
        element: <PopTicker></PopTicker>,
      },
      {
        path: "social",
        element: <Social></Social>,
      },
      {
        path: "upload-banner",
        element: <UploadBanner></UploadBanner>,
      },
    ],
  },
  {
    path: "/mt",
    element: (
      <MasterPrivetRoute>
        {" "}
        <RootLayout />{" "}
      </MasterPrivetRoute>
    ),
    children: [
      {
        path: "master",
        element: (
          <MasterPrivetRoute>
            <Master></Master>
          </MasterPrivetRoute>
        ),
      },
      {
        path: "account-summary",
        element: <AccountSummary />,
      },
      {
        path: "banking",
        element: <Banking />,
      },

      {
        path: "created-admins/:creatorId",
        element: <CreatedAdminList></CreatedAdminList>,
      },
      {
        path: "agent",
        element: <Agent></Agent>,
      },
      {
        path: "bet-list",
        element: <BetList></BetList>,
      },
      {
        path: "sub-agent",
        element: <SubAgent></SubAgent>,
      },
      {
        path: "users",
        element: <Users></Users>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "account-statement",
        element: <AccountStatement></AccountStatement>,
      },
      {
        path: "active-log",
        element: <ActiveLog></ActiveLog>,
      },
      {
        path: "live-bet",
        element: <LiveBet></LiveBet>,
      },

      {
        path: "my-report-pnl-downline",
        element: <ProfitLossReportByDownLine></ProfitLossReportByDownLine>,
      },
      {
        path: "my-report-parlay-downline",
        element: (
          <ProfitLossReportByParlayDownLine></ProfitLossReportByParlayDownLine>
        ),
      },
      {
        path: "my-report-summary-pnl",
        element: <SummaryProfitLossReport></SummaryProfitLossReport>,
      },
      {
        path: "my-report-pl-market",
        element: <ProfitLossReportByMarket></ProfitLossReportByMarket>,
      },
      {
        path: "my-report-pl-player",
        element: <ProfitLossReportByPlayer></ProfitLossReportByPlayer>,
      },
      {
        path: "my-report-pl-casino",
        element: <ProfitLossReportByAllCasino></ProfitLossReportByAllCasino>,
      },
      {
        path: "my-report-pnl-casino-downline",
        element: (
          <ProfitLossReportByCasinoDownLine></ProfitLossReportByCasinoDownLine>
        ),
      },
      {
        path: "my-report-spin",
        element: <SpinHistory></SpinHistory>,
      },
      {
        path: "my-report-spinList",
        element: <PendingSpinUsers></PendingSpinUsers>,
      },

      {
        path: "risk-management",
        element: <RiskManagement></RiskManagement>,
      },
      {
        path: "mm",
        element: <MM></MM>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "p-settings",
        element: <PSettings></PSettings>,
      },
      {
        path: "ticker",
        element: <Ticker></Ticker>,
      },
      {
        path: "pop-ticker",
        element: <PopTicker></PopTicker>,
      },
      {
        path: "social",
        element: <Social></Social>,
      },
      {
        path: "upload-banner",
        element: <UploadBanner></UploadBanner>,
      },
    ],
  },
  {
    path: "/ag",
    element: (
      <AgentPrivetRoute>
        {" "}
        <RootLayout />{" "}
      </AgentPrivetRoute>
    ),
    children: [
      {
        path: "agent",
        element: (
          <AgentPrivetRoute>
            <Agent></Agent>
          </AgentPrivetRoute>
        ),
      },
      {
        path: "account-summary",
        element: <AccountSummary />,
      },
      {
        path: "banking",
        element: <Banking />,
      },

      {
        path: "created-admins/:creatorId",
        element: <CreatedAdminList></CreatedAdminList>,
      },
      {
        path: "bet-list",
        element: <BetList></BetList>,
      },
      {
        path: "sub-agent",
        element: <SubAgent></SubAgent>,
      },
      {
        path: "users",
        element: <Users></Users>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "account-statement",
        element: <AccountStatement></AccountStatement>,
      },
      {
        path: "active-log",
        element: <ActiveLog></ActiveLog>,
      },
      {
        path: "live-bet",
        element: <LiveBet></LiveBet>,
      },

      {
        path: "my-report-pnl-downline",
        element: <ProfitLossReportByDownLine></ProfitLossReportByDownLine>,
      },
      {
        path: "my-report-parlay-downline",
        element: (
          <ProfitLossReportByParlayDownLine></ProfitLossReportByParlayDownLine>
        ),
      },
      {
        path: "my-report-summary-pnl",
        element: <SummaryProfitLossReport></SummaryProfitLossReport>,
      },
      {
        path: "my-report-pl-market",
        element: <ProfitLossReportByMarket></ProfitLossReportByMarket>,
      },
      {
        path: "my-report-pl-player",
        element: <ProfitLossReportByPlayer></ProfitLossReportByPlayer>,
      },
      {
        path: "my-report-pl-casino",
        element: <ProfitLossReportByAllCasino></ProfitLossReportByAllCasino>,
      },
      {
        path: "my-report-pnl-casino-downline",
        element: (
          <ProfitLossReportByCasinoDownLine></ProfitLossReportByCasinoDownLine>
        ),
      },
      {
        path: "my-report-spin",
        element: <SpinHistory></SpinHistory>,
      },
      {
        path: "my-report-spinList",
        element: <PendingSpinUsers></PendingSpinUsers>,
      },

      {
        path: "risk-management",
        element: <RiskManagement></RiskManagement>,
      },
      {
        path: "mm",
        element: <MM></MM>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "p-settings",
        element: <PSettings></PSettings>,
      },
      {
        path: "ticker",
        element: <Ticker></Ticker>,
      },
      {
        path: "pop-ticker",
        element: <PopTicker></PopTicker>,
      },
      {
        path: "social",
        element: <Social></Social>,
      },
      {
        path: "upload-banner",
        element: <UploadBanner></UploadBanner>,
      },
    ],
  },
  {
    path: "/sg",
    element: (
      <SubAgentPrivetRoute>
        {" "}
        <RootLayout />{" "}
      </SubAgentPrivetRoute>
    ),
    children: [
      {
        path: "sub-agent",
        element: (
          <SubAgentPrivetRoute>
            <SubAgent></SubAgent>
          </SubAgentPrivetRoute>
        ),
      },
      {
        path: "account-summary",
        element: <AccountSummary />,
      },
      {
        path: "banking",
        element: <Banking />,
      },

      {
        path: "created-admins/:creatorId",
        element: <CreatedAdminList></CreatedAdminList>,
      },
      {
        path: "bet-list",
        element: <BetList></BetList>,
      },

      {
        path: "users",
        element: <Users></Users>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "account-statement",
        element: <AccountStatement></AccountStatement>,
      },
      {
        path: "active-log",
        element: <ActiveLog></ActiveLog>,
      },
      {
        path: "live-bet",
        element: <LiveBet></LiveBet>,
      },

      {
        path: "my-report-pnl-downline",
        element: <ProfitLossReportByDownLine></ProfitLossReportByDownLine>,
      },
      {
        path: "my-report-parlay-downline",
        element: (
          <ProfitLossReportByParlayDownLine></ProfitLossReportByParlayDownLine>
        ),
      },
      {
        path: "my-report-summary-pnl",
        element: <SummaryProfitLossReport></SummaryProfitLossReport>,
      },
      {
        path: "my-report-pl-market",
        element: <ProfitLossReportByMarket></ProfitLossReportByMarket>,
      },
      {
        path: "my-report-pl-player",
        element: <ProfitLossReportByPlayer></ProfitLossReportByPlayer>,
      },
      {
        path: "my-report-pl-casino",
        element: <ProfitLossReportByAllCasino></ProfitLossReportByAllCasino>,
      },
      {
        path: "my-report-pnl-casino-downline",
        element: (
          <ProfitLossReportByCasinoDownLine></ProfitLossReportByCasinoDownLine>
        ),
      },
      {
        path: "my-report-spin",
        element: <SpinHistory></SpinHistory>,
      },
      {
        path: "my-report-spinList",
        element: <PendingSpinUsers></PendingSpinUsers>,
      },
      {
        path: "risk-management",
        element: <RiskManagement></RiskManagement>,
      },
      {
        path: "mm",
        element: <MM></MM>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "p-settings",
        element: <PSettings></PSettings>,
      },
      {
        path: "ticker",
        element: <Ticker></Ticker>,
      },
      {
        path: "pop-ticker",
        element: <PopTicker></PopTicker>,
      },
      {
        path: "social",
        element: <Social></Social>,
      },
      {
        path: "upload-banner",
        element: <UploadBanner></UploadBanner>,
      },
    ],
  },
]);
