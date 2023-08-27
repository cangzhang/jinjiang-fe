import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Select, SelectItem } from '@tremor/react';
import Chart from 'react-apexcharts';

import { INovel } from './Novels.tsx';
import { ApexOptions } from 'apexcharts';

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

const OPTIONS: Array<{
  label: string;
  value: IKeys;
  color: string;
}> = [
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
    enabled: Number(novelID) > 0
  });

  const [chartOpts, series] = useMemo(() => {
    if (!stats?.length) {
      return [{}, []];
    }

    const statName = OPTIONS.find((option) => option.value === key)?.label || key;
    const dates = stats.map((stat) => dayjs(stat.createdAt).format('MM-DD HH:mm')) || [];
    const values = stats.map((stat) => stat[key]) || [];
    const changes = stats.map((stat, idx) => {
      const v = stat[key];
      if (v === 0) {
        return 0;
      }

      return v - stats[idx - 1]?.[key];
    }) || [];

    const opts: ApexOptions = {
      chart: {
        type: 'line',
        height: 'auto'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 6
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -26
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '20%'
        }
      },
      xaxis: {
        categories: dates
      },
      yaxis: [
        {
          seriesName: statName,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true
          },
          title: {
            text: statName
          }
        },
        {
          seriesName: 'Trend',
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true
          },
          title: {
            text: 'Trend'
          }
        }
      ],
      tooltip: {
        enabled: true,
        // shared: true,
        // intersect: true,
        x: {
          show: true
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    };

    const dataset: ApexOptions['series'] = [
      {
        name: statName,
        type: 'column',
        color: '#1A56DB',
        data: values
      },
      {
        name: 'Trend',
        type: 'line',
        data: changes,
        color: '#7E3AF2'
      }
    ];

    return [opts, dataset];
  }, [key, stats]);

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

      <div className="my-12 mx-auto">
        <Chart
          type="bar"
          options={chartOpts}
          series={series}
        />
      </div>
    </main>
  );
}
