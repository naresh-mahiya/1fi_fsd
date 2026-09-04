import { Link } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 md:px-8" id="main-content">
      <ErrorState title="Page not found" message="The page you requested does not exist." />
      <div className="mt-6 text-center">
        <Link className="font-bold text-blue underline underline-offset-4" to="/">Browse phones</Link>
      </div>
    </main>
  );
}
