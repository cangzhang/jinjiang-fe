import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { BarChart, Color, Select, SelectItem } from '@tremor/react';

import { INovel } from './Novels.tsx';

dayjs.extend(localizedFormat);

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

type IKeys = 'reviews' | 'firstChapterClicks' | 'lastChapterClicks' | 'collected' | 'rewards';

const OPTIONS: Array<{ label: string; value: IKeys; color: Color; }> = [
  {
    label: 'Reviews',
    value: 'reviews',
    color: 'emerald'
  },
  {
    label: 'First Chapter Clicks',
    value: 'firstChapterClicks',
    color: 'orange'
  },
  {
    label: 'Last Chapter Clicks',
    value: 'lastChapterClicks',
    color: 'slate'
  },
  {
    label: 'Collected',
    value: 'collected',
    color: 'red'
  },
  {
    label: 'Rewards',
    value: 'rewards',
    color: 'lime'
  }
];

export function NovelStats() {
  const { novelID } = useParams();

  const [key, setKey] = useState<IKeys>('reviews');

  const { data: detail } = useQuery<INovel>({
    queryKey: ['novel-detail', novelID],
    queryFn: () => fetch(`https://jj.lbj.moe/api/novel/${novelID}/detail`).then(res => res.json()),
    enabled: Boolean(novelID)
  });
  const { data: stats } = useQuery<Array<INovelStats>>({
    queryKey: ['novel-stats', novelID],
    queryFn: () => fetch(`https://jj.lbj.moe/api/novel/${novelID}/statistics`).then(res => res.json()),
    enabled: Boolean(novelID)
  });

  const chartData = useMemo(() => stats?.map((stat) => ({
    date: dayjs(stat.createdAt).format('lll'),
    [key]: stat[key]
  })), [stats, key]);
  const color = useMemo(() => OPTIONS.find((option) => option.value === key)?.color, [key]);

  return (
    <main>
      <h1>{detail?.novelId} {detail?.title}</h1>

      <div className="max-w-sm my-6 space-y-6">
        Select Statistic:
        <Select value={key} onValueChange={(k) => setKey(k as IKeys)}>
          {
            OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
        </Select>
      </div>

      <BarChart
        className="mt-6"
        data={chartData || []}
        index="date"
        categories={[key]}
        colors={[color || 'red']}
        yAxisWidth={48}
      />
    </main>
  );
}
