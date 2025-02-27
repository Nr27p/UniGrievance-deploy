import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUpOne() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // New state for OTP
  const [showVerification, setShowVerification] = useState(false); // Toggle to show/hide OTP input
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!showVerification) {
        // Step 1: Send registration data and get verification code
        const response = await axios.post('http://localhost:5000/auth/send-verification-code', {
          username,
          email,
          password,
          phoneNumber,
        });

        // Check if the registration was successful
        if (response.status === 200) {
          toast.success("Verification code sent successfully!");
          setShowVerification(true); // Move to the next step
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        // Step 2: Verify OTP and complete registration
        const response = await axios.post('http://localhost:5000/auth/register', {
          username,
          email,
          password,
          phoneNumber,
          verificationCode,
        });

        // Check if the registration was successful
        if (response.status === 201) {
          toast.success("Account created successfully!");
          navigate("/signin");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
            <p className="mt-2 text-base text-gray-600">
              Already have an account?{' '}
              <a
                href="/signin"
                title=""
                className="font-medium text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </a>
            </p>
            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-base font-medium text-gray-900">
                    {' '}
                    Username{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Full Name"
                      id="name"
                      value={username}
                      onChange={(e)=>{setUsername(e.target.value)}}
                    ></input>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">
                    {' '}
                    Email address{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      id="email"
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      {' '}
                      Password{' '}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      id="password"
                      value={password}
                      onChange={(e)=>{setPassword(e.target.value)}}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="text-base font-medium text-gray-900">
                      {' '}
                      Phone Number{' '}
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="tel"
                        placeholder="Phone Number"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => { setPhoneNumber(e.target.value) }}
                      ></input>
                    </div>
                  </div>
                </div>
                {showVerification && (
                  <div>
                    <label htmlFor="verificationCode" className="text-base font-medium text-gray-900">
                      {' '}
                      Verification Code{' '}
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Verification Code"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      ></input>
                    </div>
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    onClick={handleSubmit}
                  >
                    {showVerification ? 'Complete Registration' : 'Create Account'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="h-screen">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=150https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
