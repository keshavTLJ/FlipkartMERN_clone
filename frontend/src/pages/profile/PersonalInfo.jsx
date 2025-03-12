import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { apiRequest } from "../../api/api";
import { useModal } from "../../context/ModalContext";
import { setUser } from "../../reducers/auth/authSlice";

function PersonalInfo({ userData, setUserData, userDataLoading }) {

  const { setShowDeleteAccountModal } = useModal();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    gender: "",
    email: "",
    mobNum: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileFormSubmit = async (e) => {
    e.preventDefault();
    // console.log(profileFormData);
    try {
      setLoading(true);
      const res = await apiRequest({
        method: 'patch',
        url: `${import.meta.env.VITE_SERVER_URL}/account`,
        data: { data: profileFormData },
      });
      setUserData(res?.data.updatedData);
      dispatch(setUser(res?.data.updatedData.name.split(" ")[0]));
      setIsEditing(false);
      toast.success("User details updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user details!");
    } finally {
      setLoading(false);
    }
  };

  function setDataInForm() {
    setProfileFormData({
      name: userData?.name ?? "",
      gender: userData?.gender ?? "",
      email: userData?.email,
      mobNum: userData?.mobNum ?? "",
    });
  }

  useEffect(() => {
    setDataInForm();
  }, [userData]);

  if (userDataLoading) {
    return <Loader size="50px" style={{ marginTop: "240px" }} />;
  }

  return (
    <div className="bg-white rounded-sm shadow-md">
      <div className="w-2/5 py-5 px-8 space-y-6">
        <div className="flex gap-6 items-center">
          <h2 className="text-lg font-medium">Personal Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 font-medium text-sm"
            >
              Edit
            </button>
          )}
        </div>
        <form onSubmit={handleProfileFormSubmit} className="space-y-6">
          {/* <div className="grid grid-cols-2 gap-4"> */}
          <div>
            <input
              type="text"
              name="name"
              value={profileFormData?.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="First Name"
              className={`w-full h-12 py-2 pl-4 border rounded-sm text-sm ${
                isEditing
                  ? "bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                  : "bg-gray-50 text-gray-500 cursor-not-allowed"
              }`}
            />
          </div>
          {/* </div> */}
          <div className="space-y-3">
            <p className="text-sm  mb-2 text-left">Your Gender</p>
            <div className="flex space-x-6">
              <label
                className={`flex items-center ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                } `}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profileFormData?.gender === "male"}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-4 h-4 text-blue-600`}
                />
                <span className={`ml-2 text ${!isEditing && "text-gray-500"}`}>
                  Male
                </span>
              </label>
              <label
                className={`flex items-center ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                } `}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profileFormData?.gender === "female"}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-4 h-4 text-blue-600`}
                />
                <span className={`ml-2 ${!isEditing && "text-gray-500"}`}>
                  Female
                </span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-2">
              <label className="text-lg mb-2 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileFormData?.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full h-12 py-2 pl-4 border rounded-sm text-sm ${
                  isEditing
                    ? "bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <label className="text-lg mb-2 font-semibold">
                Mobile Number
              </label>
              <input
                type="number"
                name="mobNum"
                value={profileFormData?.mobNum}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full h-12 py-2 pl-4 border rounded-sm text-sm ${
                  isEditing
                    ? "bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
                maxLength={10}
              />
            </div>
          </div>
          {isEditing && (
            <div className="flex space-x-4">
              <button
                type="submit"
                className={`${loading ? "outline outline-2 outline-[#2874f0]" : "bg-[#2874f0]"} 
                px-12 py-3 text-white font-medium rounded-sm`}
              >
                {!loading ? ("SAVE") 
                  : (
                  <Loader
                    size="20px"
                    borderWidth="2px"
                  />
                )}
              </button>
              {!loading && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDataInForm();
                }}
                className="px-6 py-2 text-blue-600 font-medium"
              >
                Cancel
              </button>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="flex flex-col items-start px-8 gap-5 mt-12">
        <div className="text-lg font-medium">FAQs</div>
        <div className="flex flex-col items-start gap-4">
          <h4 className="text-sm font-medium">
            What happens when I update my email address (or mobile number)?
          </h4>
          <p className="text-sm text-start">
            Your login email id (or mobile number) changes, likewise. You'll
            receive all your account related communication on your updated email
            address (or mobile number).
          </p>
          <h4 className="text-sm font-medium">
            When will my Flipkart account be updated with the new email address
            (or mobile number)?
          </h4>
          <p className="text-sm text-start">
            It happens as soon as you confirm the verification code sent to your
            email (or mobile) and save the changes.
          </p>
          <h4 className="text-sm font-medium">
            What happens to my existing Flipkart account when I update my email
            address (or mobile number)?
          </h4>
          <p className="text-sm text-start">
            Updating your email address (or mobile number) doesn't invalidate
            your account. Your account remains fully functional. You'll continue
            seeing your Order history, saved information and personal details.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-8 mt-10">
        {/* <button className="text-blue-600 text-sm font-medium block">Deactivate Account</button> */}
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="text-red-600 text-sm font-medium block pt-4"
        >
          Delete Account
        </button>
      </div>

      <div>
        <img
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myProfileFooter_4e9fe2.png"
          alt=""
          className="w-full"
        />
      </div>

      {/* {showConfirmationModal && (
        
      )} */}
    </div>
  );
}

export default PersonalInfo;
