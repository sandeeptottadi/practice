import React from "react";
import Switch from "@mui/joy/Switch";
import DarkMode from "@mui/icons-material/DarkMode";

export default function Navbar(props: {
  changeTheme: (theme: "light" | "dark") => void;
}) {
  function toogleTheme() {
    const rawTheme: string | null =
      document.documentElement.getAttribute("data-theme");
    const theme: "light" | "dark" =
      rawTheme === "light" || rawTheme === "dark" ? rawTheme : "light";

    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      props.changeTheme("light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      props.changeTheme("dark");
    }
  }
  return (
    <div
      style={{ backgroundColor: "var(--background-secondary)" }}
      className="h-10 w-full pl-4 p-2 flex flex-row gap-6 items-center"
    >
      <div className=" text-green-400 leading-8 text-2xl">Practice</div>
      <select
        className=" rounded p-3"
        style={{ backgroundColor: "var(--background-title)" }}
      >
        <option value="Javascript">Javascript</option>
        <option value="Python">Python</option>
        <option value="C++">C++</option>
      </select>
      <button
        onClick={() => toogleTheme()}
        id="mode"
        className="p-4 bg-blue-500 text-white rounded"
      >
        Theme
      </button>
    </div>
  );
}
