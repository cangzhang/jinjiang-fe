import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { groupBy } from 'lodash';

export interface INovel {
  id: string;
  title: string;
  novelId: number;
  authorId: number;
  listName: string;
  inList: boolean;
}

export function NovelList() {
  const [filter, setFilter] = useState('');

  const {data: rawList, isLoading} = useQuery<Array<INovel>>({
    queryKey: ['novels'],
    queryFn: () => fetch('https://jj.lbj.moe/api/novels').then(res => res.json())
  });

  const [tabs, grouped] = useMemo(() => {
    const ret = groupBy(rawList, 'listName');
    const names = Object.keys(ret);
    return [names, ret];
  }, [rawList]);

  useEffect(() => {
    if (tabs.length) {
      setFilter(tabs[0]);
    }
  }, [tabs]);

  return (
    <div className="flex-col">
      <div className="flex">
        <div
          className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-gray-700 dark:hover:bg-gray-600">
          <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
            {tabs?.map((tab, idx) => {
              const active = filter === tab;

              if (active) {
                return (
                  <button
                    key={tab}
                    type="button"
                    className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-gray-800 hs-tab-active:dark:text-gray-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 font-medium rounded-md hover:hover:text-blue-600 dark:text-gray-400 dark:hover:text-white active"
                    id={`segment-item-${idx}`} data-hs-tab={`#segment-${idx}`} aria-controls={`segment-${idx}`}
                    role="tab"
                    onClick={() => setFilter(tab)}
                  >
                    {tab}
                  </button>
                );
              }

              return (
                <button
                  key={tab}
                  type="button"
                  className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-gray-800 hs-tab-active:dark:text-gray-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 font-medium rounded-md hover:hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300"
                  id={`segment-item-${idx}`} data-hs-tab={`#segment-${idx}`} aria-controls={`segment-${idx}`}
                  role="tab"
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-3">
          {tabs?.map((tab, idx) => {
            return (
              <div id={`segment-${idx}`} role="tabpanel" aria-labelledby={`segment-item-${idx}`} key={tab}/>
            );
          })}
        </div>
      </div>

      {!isLoading && <div className="flex flex-col mt-3">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">List</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {grouped[filter]?.map((item) => (
                  <tr key={item.novelId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      <Link
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        to={`/novel/${item.novelId}`}>
                        {item.novelId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.authorId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.listName}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
