import React, { useState } from "react";

const ExperienceForm: React.FC = () => {
  const [name, setName] = useState("");
  const [root, setRoot] = useState("Artefact");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Experience Created:", { name, root });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-[var(--primary-bg)] p-4 rounded-md"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="root"
          className="block text-sm font-medium text-gray-700"
        >
          Select Root
        </label>
        <select
          id="root"
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Artefact">Artefact</option>
          {/* Add more options here if needed */}
        </select>
      </div>
    </form>
  );
};

export default ExperienceForm;
