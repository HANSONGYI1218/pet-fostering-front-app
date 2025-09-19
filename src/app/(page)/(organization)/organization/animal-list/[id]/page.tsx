import BackButton from '@/components/common/back-button';
import { dummyOgrainzationAnimalDetails } from '@/lib/dummydata';
import AnimalDetailContainer from '@/components/organization/animal-list/animal-detail-container';

export default async function AnimalListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const animal = dummyOgrainzationAnimalDetails.find(
    (animal) => animal?.id === id,
  );

  return (
    <main className="bg-neutral-50">
      <div className="container_12 mx-auto flex min-h-screen w-full flex-col gap-6 pt-20 pb-40">
        <BackButton link="/foster-list" />
        {animal ? (
          <AnimalDetailContainer animal={animal} />
        ) : (
          <div>없어요~!</div>
        )}
      </div>
    </main>
  );
}
