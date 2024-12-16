"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import logo from "./assets/robot.png";
import Image from "next/image";

function AdviceSection({ advice }: { advice: string }) {
  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Your Personalized Advice
      </h2>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{advice}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function Home() {
  const [mood, setMood] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const moodThemes: Record<string, string> = {
    happy: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-400",
    sad: "bg-gradient-to-r from-gray-600 to-gray-900",
    angry: "bg-gradient-to-r from-red-700 to-red-900",
    confused: "bg-gradient-to-r from-purple-500 to-indigo-700",
    excited: "bg-gradient-to-r from-pink-500 to-yellow-500",
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
  };

  const introText = "Hi! I am your personal mood advisor.";

  useEffect(() => {
    if (textIndex < introText.length) {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [textIndex]);

  const fetchAdvice = async () => {
    if (!mood || !name || !profession) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/get-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, name, profession }),
      });
      const data = await response.json();
      if (data.advice) {
        setAdvice(data.advice);
      } else {
        setAdvice("Could not fetch advice. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("Error occurred while fetching advice.");
    }
    setLoading(false);
  };

  const currentTheme = moodThemes[mood.toLowerCase()] || moodThemes.default;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${currentTheme} text-white`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-200 text-gray-700 p-3 rounded-full shadow-md">
          <Image src={logo} alt="Robot Logo" width={50} height={50} />
        </div>
        <h1 className="text-2xl font-bold">{introText.slice(0, textIndex)}</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-gray-800">
        <label htmlFor="name" className="block text-lg font-medium mb-2">
          Your Name:
        </label>
        <input
          id="name"
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <label htmlFor="profession" className="block text-lg font-medium mb-2">
          Your Profession:
        </label>
        <select
          id="profession"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        >
          <option value="" disabled>
            Select your profession
          </option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Teacher">Teacher</option>
          <option value="Engineer">Engineer</option>
          <option value="Doctor">Doctor</option>
        </select>
        <label htmlFor="mood" className="block text-lg font-medium mb-2">
          Your Mood:
        </label>
        <select
          id="mood"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="" disabled>
            Select your mood
          </option>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Angry">Angry</option>
          <option value="Confused">Confused</option>
          <option value="Excited">Excited</option>
        </select>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-bold transition duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching...</span>
            </div>
          ) : (
            "Get Advice"
          )}
        </button>
      </div>
      {advice && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mt-6 text-gray-800">
          <AdviceSection advice={advice} />
        </div>
      )}
    </div>
  );
}
