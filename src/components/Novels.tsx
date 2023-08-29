import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { groupBy } from 'lodash';
import {
  Tab,
  TabGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TabList
} from '@tremor/react';

export interface INovel {
  id: string;
  title: string;
  novelId: number;
  authorId: number;
  listName: string;
  inList: boolean;
}

export function NovelList() {
  const [tabIdx, setTabIdx] = useState(0);

  const {data: rawList, isLoading} = useQuery<Array<INovel>>({
    queryKey: ['novels'],
    queryFn: () => fetch('https://jj.lbj.moe/api/novels').then(res => res.json())
  });

  const [tabs, grouped] = useMemo(() => {
    const ret = groupBy(rawList, 'listName');
    const names = Object.keys(ret);
    return [names, ret];
  }, [rawList]);
  
  const targetList = useMemo(() => {
    const list = grouped[tabs?.[tabIdx]];
    if (!list) return [];

    return [
      ...list.filter(i => i.inList),
      ...list.filter(i => !i.inList)
    ];
  }, [grouped, tabIdx, tabs]);

  return (
    <div className="flex-col">
      <div className="flex">
        <div
          className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-gray-700 dark:hover:bg-gray-600">
          <TabGroup index={tabIdx} onIndexChange={setTabIdx}>
            <TabList color="gray" variant="solid">
              {tabs?.map((tab) => (
                <Tab key={tab}>{tab}</Tab>
              ))}
            </TabList>
          </TabGroup>
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
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Author ID</TableHeaderCell>
              <TableHeaderCell>List</TableHeaderCell>
              <TableHeaderCell>On List</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {targetList.map((item) => (
              <TableRow key={item.novelId}>
                <TableCell>
                  <Link
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    to={`/novel/${item.novelId}`}>
                    {item.novelId}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.title}
                </TableCell>
                <TableCell>
                  {item.authorId}
                </TableCell>
                <TableCell>
                  {item.listName}
                </TableCell>
                <TableCell>
                  {item.inList && '✅'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>}
    </div>
  );
}
