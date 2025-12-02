import { FaWallet } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { FiBarChart } from "react-icons/fi";
import { CiViewList } from "react-icons/ci";
import { GoHistory } from "react-icons/go";
import { ImProfile } from "react-icons/im";
import { PiHandDepositFill, PiHandWithdrawFill } from "react-icons/pi";

const menuItems = [
  {
    id: 1,
    label: "Balance Overview",
    Icon: FaWallet,
    link: "/balance-overview",
  },
  {
    id: 2,
    label: "Current Bets",
    link: "/current-bets",
    Icon: CiViewList,
    count: 0,
  },
  {
    id: 3,
    label: "Account Statement",
    Icon: CiViewList,
    link: "/account-statement",
  },
  { id: 4, label: "Bets History", Icon: GoHistory, link: "/bets-history" },
  
  // {
  //   id: 5,
  //   label: "Deposit",
  //   Icon: PiHandDepositFill,
  //   link: "/deposit",
  // },
  {
    id: 6,
    label: "Profit & Loss",
    Icon: FaHandHoldingDollar,
    link: "/profit-loss",
  },
  {
    id: 7,
    label: "Withdraw",
    Icon: PiHandWithdrawFill ,
    link: "/withdraw",
  },
  { id: 8, label: "Activity Log", Icon: FiBarChart, link: "/activity-log" },
  { id: 9, label: "My Profile", Icon: ImProfile, link: "/my-profile" },
];

export default menuItems;
