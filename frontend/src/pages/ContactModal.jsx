import { useState } from "react";
import emailjs from "emailjs-com";
// import { sendContact } from "../api/contact.api";

export default function ContactModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Background blur */}
      <div
        className="absolute inset-0  backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="
        relative
        bg-[#07284e] 
        border border-cyan-400/30
        rounded-2xl
        p-8
        w-full max-w-md
        shadow-[0_0_40px_rgba(34,211,238,0.3)]
      ">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Contact Us
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#063f81]  border border-gray-700 focus:border-cyan-400 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#063f81]  border border-gray-700 focus:border-cyan-400 outline-none"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message..."
            value={form.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-lg bg-[#063f81] border border-gray-700 focus:border-cyan-400 outline-none"
            required
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-600 rounded-lg hover:border-red-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-cyan-400 text-black rounded-lg font-semibold hover:scale-105 transition"
            >
              Send
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}