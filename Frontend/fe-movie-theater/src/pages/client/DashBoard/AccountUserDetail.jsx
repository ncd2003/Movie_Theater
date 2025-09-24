import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import LeftSideBarUser from "./LeftSideBarUser";
import AccountApi from "../../../api/AccountApi";
import { toast } from "react-toastify";
import { handleApiRequest } from "../../../utils/ApiHandler";
import FileApi from "../../../api/FileApi";

function AccountUserDetail() {
  const [user, setUser] = useState({
    id: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    gender: "",
    image: "",
    email: "",
    birthDate: "",
    identityCard: "",
  });
  const [errors, setErrors] = useState({});

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [oldImage, setOldImage] = useState(null);
  const fetchUserProfile = async () => {
    await handleApiRequest({
      apiCall: () => AccountApi.getAccount(),
      onSuccess: (res) => {
        console.log(res.data);
        setUser(res.data);
        setOldImage(res.data.image);
      },
      showSuccessToast: false,
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let imageUrl1;

    if (image instanceof File && oldImage) {
      await handleApiRequest({
        apiCall: () => FileApi.deleteFile(oldImage),
        showSuccessToast: false,
        errorMessage: "Failed to delete old image.",
      });
    }

    // Nếu có upload ảnh mới
    if (image instanceof File) {
      const formDataImage = new FormData();
      formDataImage.append("file", image);
      formDataImage.append("folder", "users");

      await handleApiRequest({
        apiCall: () => FileApi.uploadFile(formDataImage),
        onSuccess: async (res) => {
          imageUrl1 = res;
        },
        showSuccessToast: false,
        errorMessage: "Failed to upload image.",
      });
    }

    // Tạo object userUpdate từ user, không sửa email & CCCD
    const updatedUserData = {
      ...user,
      email: undefined,
      identityCard: undefined,
      image: imageUrl1 ? imageUrl1 : user.image,
    };

    await handleApiRequest({
      apiCall: () => AccountApi.updateAccount(user.accountId, updatedUserData),
      onSuccess: () => {
        fetchUserProfile();
      },
      successMessage: "Update successfully",
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    const phoneRegex = /^\d{10}$/;
    const today = new Date();

    if (!user.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    }
    if (!phoneRegex.test(user.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (user.address.trim().length < 5) {
      tempErrors.address = "Address must be at least 5 characters.";
    }
    if (!user.birthDate) {
      tempErrors.birthDate = "Birthdate is required.";
    } else {
      const birthDate = new Date(user.birthDate);
      if (birthDate >= today) {
        tempErrors.birthDate = "Birthdate must be in the past.";
      }
    }
    if (!user.gender) {
      tempErrors.gender = "Please select a gender.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Lưu ảnh base64 vào state imageUrl để preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#FDFCF0]">
        <div className="relative mb-5">
          <div className="absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]"></div>
        </div>

        <div className="flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]">
          <LeftSideBarUser />

          <div className="flex-[4] mt-5 ml-[-50px]">
            <p className="text-xl text-white bg-slate-900 text-center py-[2px] mb-5">
              CHANGE INFORMATION
            </p>

            <form onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="mb-4">
                <label className="block font-medium">Avatar</label>
                {(imageUrl || user.image) && (
                  <img
                    src={imageUrl || user.image}
                    alt="Avatar Preview"
                    className="w-24 h-24 object-cover rounded-full mb-2 border"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block"
                />
              </div>

              {/* Email - Không cho phép chỉnh sửa */}
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>
              {/* Họ và tên */}
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {/* CCCD/CMND - Không cho phép chỉnh sửa */}
              <div>
                <label className="block font-medium">Identity Card</label>
                <input
                  type="text"
                  value={user.identityCard}
                  disabled
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg"
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Giới tính */}
              <div>
                <p className="block font-medium">Gender</p>
                <label style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={user.gender === "MALE"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={user.gender === "FEMALE"}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="OTHER"
                    checked={user.gender === "OTHER"}
                    onChange={handleChange}
                  />
                  Other
                </label>
                {errors.gender && (
                  <p className="text-red-500">{errors.gender}</p>
                )}
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  value={user.birthDate}
                  onChange={handleChange}
                  className="w-2/3 mt-1 px-4 py-2 border rounded-lg"
                />
                {errors.birthDate && (
                  <p className="text-red-500">{errors.birthDate}</p>
                )}
              </div>

              {/* Nút Lưu */}
              <button
                type="submit"
                className="block bg-red-500 text-lg font-medium text-white px-5 rounded-lg m-auto mt-4"
              >
                SAVE
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AccountUserDetail;
