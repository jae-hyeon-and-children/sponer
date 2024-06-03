interface SizeTableProps {
  tableHeader: string[];
  tableBody: Object[];
}

export default function SizeTable({ tableHeader, tableBody }: SizeTableProps) {
  return (
    <table className="w-full table-fixed">
      <caption className="heading-1 text-gray-900 text-center mb-6">
        사이즈 가이드
      </caption>
      <thead className=" border-b border-gray-200">
        <tr>
          {tableHeader.map((value, index) => (
            <td
              className="label-1 text-gray-600 py-2 px-4 text-center"
              key={index}
            >
              {value}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableBody.map((item, index) => (
          <tr
            className="label-2 text-center  text-gray-500 odd:bg-white even:bg-gray-100"
            key={index}
          >
            {Object.entries(item).map(([key, value], index) => (
              <td className="py-2 px-4" key={key}>
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
