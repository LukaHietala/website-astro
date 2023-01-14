import { createEffect, createSignal } from "solid-js";

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal(
    localStorage.getItem("theme") ?? "light"
  );

  const handleClick = () => {
    setTheme(theme() === "light" ? "dark" : "light");
  };

  createEffect(() => {
    if (theme() === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme());
  });

  return (
    <button
      onClick={() => handleClick()}
      className="p-2 hover:bg-slate-200 rounded-md hover:dark:bg-neutral-800"
    >
      {theme() === "light" ? "🌙" : "🌞"}
    </button>
  );
}
