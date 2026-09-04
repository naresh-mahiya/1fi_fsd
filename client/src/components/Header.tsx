import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-ink/15 bg-white">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link className="flex items-center gap-3 font-bold tracking-[-0.04em]" to="/" aria-label="FlexiBuy home">
          <span className="grid size-9 place-items-center bg-blue text-lg text-white">F</span>
          <span className="text-xl">FlexiBuy</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="Main navigation">
          <NavLink className="nav-link" to="/">
            Phones
          </NavLink>
          <a className="nav-link" href="/#how-it-works">
            How it works
          </a>
        </nav>

        <button
          className="grid size-11 place-items-center border border-ink/20 md:hidden"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-ink/15 px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <NavLink className="block min-h-11 py-3 font-semibold" to="/" onClick={() => setMenuOpen(false)}>
            Phones
          </NavLink>
          <a className="block min-h-11 py-3 font-semibold" href="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
        </nav>
      )}
    </header>
  );
}
