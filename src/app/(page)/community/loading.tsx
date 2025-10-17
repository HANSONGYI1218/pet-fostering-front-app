export default function Loading() {
  return (
    <main className="mb-24 flex min-h-screen w-full flex-col gap-6 bg-neutral-50 py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-200" />
        <div className="min-h-[220px] animate-pulse rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="h-8 w-2/3 rounded bg-neutral-200" />
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-200" />
              <div className="h-10 flex-1 rounded bg-neutral-200" />
            </div>
            <div className="h-32 rounded bg-neutral-200" />
          </div>
        </div>
        <div className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="h-6 w-40 rounded bg-neutral-200" />
            <div className="flex flex-col gap-3">
              <div className="h-16 rounded bg-neutral-200" />
              <div className="h-16 rounded bg-neutral-200" />
              <div className="h-16 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
