import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm border-2 border-text p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2 border-text">
          <span className="text-xl font-bold text-text">!</span>
        </div>
        <h1 className="mb-2 text-xl font-bold uppercase text-text">
          403 Forbidden
        </h1>
        <p className="mb-6 text-sm text-text">
          You do not have permission to access this area.
        </p>
        <Link
          href="/"
          className="inline-block w-full border-2 border-text bg-text px-4 py-2 text-sm font-bold text-background hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
