import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
    const [password, setPassword] = useState("password");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send a request to your API to update the user's information
    console.log("Updating profile:", { name, email, emailPreferences });
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate(0); // Refresh the page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div>
        <label htmlFor="name" className="block text-m font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-3 block w-96 rounded-md border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-m font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-3 block w-96 rounded-md border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-m font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-3 block w-96 rounded-md border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
     
      <button
        type="submit"
        className="w-96 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
      >
        Update Profile
      </button>
    </form>
  );
}

export default ProfileForm;

