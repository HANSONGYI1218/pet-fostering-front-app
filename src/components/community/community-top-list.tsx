import { Card } from '../ui/card';
import TopListTile from './top-list-tile';

export default function CommunityTopList() {
  return (
    <Card>
      <span className="text-xl font-bold">이번 주 HOT 게시글</span>
      <div className="flex w-full flex-1 flex-col gap-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <TopListTile key={idx} index={idx} />
        ))}
      </div>
    </Card>
  );
}
