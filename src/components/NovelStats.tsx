import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INovel } from './Novels.tsx';

export interface INovelStats {
  id: string;
  novelId: number;
  firstChapterClicks: number;
  lastChapterClicks: number;
  reviews: number;
  collected: number;
  rewards: number;
  createdAt: string;
  updatedAt: string;
}

export function NovelStats() {
  const {novelID} = useParams();

  const { data: detail } = useQuery<INovel>({
    queryKey: ['novel-detail', novelID],
    queryFn: () => fetch(`https://jj.lbj.moe/api/novel/${novelID}/detail`).then(res => res.json()),
    enabled: Boolean(novelID),
  });
  const {data: stats} = useQuery<Array<INovelStats>>({
    queryKey: ['novel-stats', novelID],
    queryFn: () => fetch(`https://jj.lbj.moe/api/novel/${novelID}/statistics`).then(res => res.json()),
    enabled: Boolean(novelID)
  });

  return (
    <main>
      <h1>{detail?.novelId} {detail?.title}</h1>
      <div>Records: {stats?.length}</div>
    </main>
  );
}
