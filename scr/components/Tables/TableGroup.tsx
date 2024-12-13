import MenuIcon from '@mui/icons-material/Menu';

type Column<T> = {
  key: keyof T;
  label: string;
  align?: 'right' | 'left' | 'center';
};

type CollapsibleTableProps<T> = {
  columns: Column<T>[];
  rows: T[]; 
  option:(deatil: T) => void
};

const TableGroup = <T extends Record<string, any>>({
  columns,
  rows,
  option
}: CollapsibleTableProps<T>) => { 
  return (
    <div className="overflow-x-auto p-2 bg-white rounded-lg">
        <table className="min-w-full border-collapse border">
        <thead>
            <tr className="bg-black-2 text-white"> 
                <th></th>
              {columns.map((column) => (
                  <th
                  key={String(column.key)}
                  className={`p-2 ${
                      column.align === 'right' ? 'text-right' : 'text-left'
                  } font-medium`}
                  >
                  {column.label}
                  </th>
              ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => (
              <tr className="odd:bg-slate-200  " key={index}> 
                <td className="p-2 flex justify-center">
                  <button className='bg-purple-500 rounded-full text-white p-1 hover:bg-purple-600' onClick={()=>option(row)}>
                      <MenuIcon/>
                  </button>
                </td>
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-4 py-2 text-sm font-bold ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {row[column.key]}
                  </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default TableGroup;
