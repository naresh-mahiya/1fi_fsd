import { AlertCircle } from "lucide-react";

type Props = {
  title?: string;
  message: string;
  retry?: () => void;
};

export function ErrorState({ title = "We couldn't load this page", message, retry }: Props) {
  return (
    <section className="mx-auto max-w-2xl border border-ink/20 px-6 py-12 text-center" role="alert">
      <AlertCircle className="mx-auto mb-5 text-blue" aria-hidden="true" size={34} />
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-ink/70">{message}</p>
      {retry && (
        <button className="button-primary mt-7" type="button" onClick={retry}>
          Try again
        </button>
      )}
    </section>
  );
}
