import PageHeader from "@/components/shared/PageHeader";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { user, setUser, reload } = useContext(AuthContext);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      number: user?.number || "",
      password: "",
    },
  });

  // Reset form when user changes
  useEffect(() => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      number: user?.number || "",
      password: "",
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admins/update-profile/${user._id}`,
        data
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully");

        // Update AuthContext with new user data
        setUser(res.data.user);

        // Reload balance or other dependent data
        reload();

        // Reset form password
        reset({ ...data, password: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  return (
    <div className="mt-16">
      <PageHeader title="My Profile" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow-md border border-gray-200 m-4">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-2 py-1 font-semibold text-gray-600 w-1/3">
                  First Name
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    placeholder={user?.firstName || "First Name"}
                    className={`w-full p-1 border rounded ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-2 py-1 font-semibold text-gray-600">Last Name</td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    placeholder={user?.lastName || "Last Name"}
                    className={`w-full p-1 border rounded ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </td>
              </tr>

              

              <tr className="border-b border-gray-200">
                <td className="px-2 py-1 font-semibold text-gray-600">Contact Number</td>
                <td className="px-2 py-1">
                  <input
                    type="tel"
                    {...register("number")}
                    placeholder={user?.number || "Contact Number"}
                    className={`w-full p-1 border rounded ${
                      errors.number ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.number && (
                    <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                  )}
                </td>
              </tr>

              <tr>
                <td className="px-2 py-1 font-semibold text-gray-600">Password</td>
                <td className="px-2 py-1 flex items-center justify-between">
                  <input
                    type="password"
                    {...register("password")}
                    className={`w-full p-1 border rounded ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Password (leave blank to keep current)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 flex justify-end">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md flex items-center font-medium"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
