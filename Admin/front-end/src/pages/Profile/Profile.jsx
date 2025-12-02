import React, { useState, useContext } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { motherAdmin, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/change-password`,
        {
          adminId: motherAdmin._id,
          currentPassword,
          newPassword,
        }
      );

      toast.success(response.data.message);
      handleCloseModal();
      // logout(); // Logout after successful password change
      // Optional: Redirect to login page (if using react-router-dom)
      // import { useNavigate } from "react-router-dom";
      // const navigate = useNavigate();
      // navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="bg-white border border-gray-300 rounded-md shadow-md p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-black text-white px-3 py-1 rounded font-semibold">
            WL
          </span>
          <h2 className="font-semibold text-lg">{motherAdmin.username}</h2>
        </div>

        <h3 className="text-lg font-semibold mb-3">Profile</h3>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Section */}
          <div className="border rounded">
            <div className="bg-[#2f4858] text-white font-semibold px-3 py-2 rounded-t">
              About You
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium w-1/3">Full Name</td>
                  <td className="p-2">{motherAdmin.username}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Domain</td>
                  <td className="p-2">velki@.live</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Password</td>
                  <td className="p-2 flex items-center justify-between">
                    <span>*******</span>
                    <button
                      onClick={handleOpenModal}
                      className="text-blue-600 flex cursor-pointer items-center gap-1 hover:underline"
                    >
                      Edit <FaEdit size={13} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Section */}
          <div className="border rounded">
            <div className="bg-[#2f4858] text-white font-semibold px-3 py-2 rounded-t">
              Limits & Commission
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium w-1/2">Exposure Limit</td>
                  <td className="p-2">20,000.00</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Exchange Commission (%)</td>
                  <td className="p-2">0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[350px]">
            {/* Modal Header */}
            <div className="bg-yellow-600 text-white px-4 py-2 flex justify-between items-center rounded-t">
              <h3 className="font-semibold">Change Password</h3>
              <button className="cursor-pointer" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <form className="space-y-3" onSubmit={handlePasswordChange}>
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter"
                    className="w-full border px-2 py-1 mt-1 rounded outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    New Password Confirm
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter"
                    className="w-full border px-2 py-1 mt-1 rounded outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Your Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter"
                    className="w-full border px-2 py-1 mt-1 rounded outline-none"
                    required
                  />
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 text-white font-semibold px-5 py-1 rounded"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;