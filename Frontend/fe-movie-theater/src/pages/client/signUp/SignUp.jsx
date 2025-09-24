import { useState } from "react";
import { handleApiRequest } from "../../../utils/ApiHandler";
import AuthApi from "../../../api/AuthApi";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";

function SignUpForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({}); // ✅ State for errors
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    identityCard: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    birthDate: "",
    gender: "",
    address: "",
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // ✅ Clear error when typing
    // if (e.target.name === "birthDate") {
    //   setDisplayBirthDate(e.target.value);
    // }
  };

  // ✅ Validation Function
  const validateFormStep1 = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idRegex = /^\d{9,12}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!idRegex.test(formData.identityCard)) {
      newErrors.identityCard = "Identity Card must be 9-12 digits.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, and a number.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormStep2 = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    if (!formData.fullName) {
      newErrors.fullName = "Please input full name.";
    }
    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
    }
    if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "Birthdate is required.";
    } else if (formData.birthDate >= today) {
      newErrors.birthDate = "Birthdate must be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateFormStep1()) {
      setStep(2);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormStep2()) return;
    await handleApiRequest({
      apiCall: () => AuthApi.register(formData),
      onSuccess: () => navigate("/user/signIn"),
      successMessage: "Register success!",
    });
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center " style={{ marginTop: '45px' }}>

        <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden" style={{ border: '1px solid rgb(210, 212, 200)', borderRadius: '10px', marginBottom: '50px' }}>
          {/* Left Column */}
          <div className="w-1/2 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col justify-center items-center p-10 relative">
            <img
              src="https://blog.masterkorean.vn/storage/photos/blog/images/34234_1721190352.JPG"
              alt="Background"
              className="w-full h-full object-cover absolute top-0 left-0 rounded"
            />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl font-bold">{step === 1 ? "Welcome!" : "Almost Done!"}</h2>
              <p className="mt-4 text-lg">{step === 1 ? "Enter your basic details." : "Complete your profile."}</p>
            </div>
          </div>
          {/* Right Column */}
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center text-gray-900">{step === 1 ? "Create Account" : "Complete Profile"}</h2>

            {step === 1 ? (
              <form onSubmit={handleNext}>
                <div>
                  <input type="number" name="phoneNumber" placeholder="Phone Number" className="w-full p-3 border rounded-lg mt-4" value={formData.phoneNumber} onChange={handleChange} />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg mt-4" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                  <input type="text" name="identityCard" placeholder="Identity Card" className="w-full p-3 border rounded-lg mt-4" value={formData.identityCard} onChange={handleChange} />
                  {errors.identityCard && <p className="text-red-500 text-sm">{errors.identityCard}</p>}
                </div>

                <div>
                  <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg mt-4" value={formData.password} onChange={handleChange} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div>
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full p-3 border rounded-lg mt-4" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" className="w-36 bg-blue-900 text-white py-3 mt-4 rounded-lg mx-auto">Next</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <input type="text" name="fullName" placeholder="Full Name" className="w-full p-3 border rounded-lg mt-4" value={formData.fullName} onChange={handleChange} />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div>
                  <input type="date" name="birthDate" className="w-full p-3 border rounded-lg mt-4" value={formData.birthDate} onChange={handleChange} />
                  {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
                </div>

                <div>
                  <select name="gender" className="w-full p-3 border rounded-lg mt-4" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                <div>
                  <input type="text" name="address" placeholder="Address" className="w-full p-3 border rounded-lg mt-4" value={formData.address} onChange={handleChange} />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <div className="flex justify-between mt-4">
                  <button onClick={handleBack} className="w-36 bg-gray-500 text-white py-3 rounded-lg">Back</button>
                  <button type="submit" className="w-36 bg-blue-900 text-white py-3 rounded-lg">Submit</button>
                </div>
              </form>
            )}
            {/* back to sign in */}
            <div className="text-right mt-2">
              Already have account? Sign in
              <Link to="/user/signIn" className="text-blue-600 text-sm">
                &nbsp;here
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUpForm;
