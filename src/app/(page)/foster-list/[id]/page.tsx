import BackButton from '@/components/common/back-button';

export default async function FosterListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] gap-6 pt-20 pb-40">
        <BackButton link="/foster-list" />
      </div>
    </main>
  );
}
