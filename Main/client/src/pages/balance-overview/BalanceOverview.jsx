import PageHeader from "@/components/shared/PageHeader";
import { useGetBankingsQuery } from "@/redux/features/allApis/bankingApi/bankingApi";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // adjust the path if needed
import { useSelector } from "react-redux";
import UserTransactionHistory from "../UserTransactionHistory/UserTransactionHistory";

const BalanceOverview = () => {
  const { user,balance,loading } = useContext(AuthContext); // ⬅️ Using AuthContext instead of Redux






  if (loading) {
    return (
      <div className="mt-16">
        <PageHeader title="Balance Overview" />
        <div className="m-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="mt-16">
      <PageHeader title="Balance Overview" />
      <div className="m-4 min-h-screen">
        {/* Current Balance Card */}
        <div className="bg-[#262c32] p-3 rounded-2xl">
          <h1 className="text-xl font-bold text-white mb-2">Your Balances</h1>
          <div className="flex flex-row items-center gap-3">
            <p className="text-sm font-bold bg-yellow-500 py-0.5 px-1 rounded-lg">
              PBU
            </p>
            <p className="text-2xl font-bold text-white leading-3">
              {balance || "0.00"}
            </p>
          </div>
        </div>

    <UserTransactionHistory></UserTransactionHistory>
      
      </div>
    </div>
  );
};

export default BalanceOverview;
