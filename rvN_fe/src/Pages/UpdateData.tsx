import React, { useState } from 'react';

const people = [
  {
    name: 'Tiger',
    count: 34,
  },
  {
    name: 'Rhinoserous',
    count: 23,
  },
  {
    name: 'Elephant',
    count: 12,
  },
  {
    name: 'Lion',
    count: 45,
  },
  {
    name: 'Giraffe',
    count: 19,
  },
];

const UpdateData = () => {
  const [data, setData] = useState(people);

  const handleIncrement = (index) => {
    const updatedData = [...data];
    updatedData[index].count += 1;
    setData(updatedData);
  };

  const handleDecrement = (index) => {
    const updatedData = [...data];
    updatedData[index].count -= 1;
    setData(updatedData);
  };

  return (
    <>
      <section className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="text-3xl font-semibold mb-7">Update Data</h2>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr className="divide-x divide-gray-300">
                      <th
                        scope="col"
                        className="px-8 py-3.5 text-left text-lg font-normal text-gray-600 "
                      >
                        <span>Animal Name</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-lg font-normal text-gray-600 "
                      >
                        Animal Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((person, index) => (
                      <tr key={person.name} className="divide-x divide-gray-200">
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">{person.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4 flex space-x-14">
                          <div className="text-lg text-gray-900">{person.count}</div>
                          <div className="text-lg text-white">
                            <button
                              className='px-2 py-0.5 bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline-green'
                              onClick={() => handleIncrement(index)}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-lg text-white">
                            <button
                              className='px-2.5 py-0.5 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:shadow-outline-red'
                              onClick={() => handleDecrement(index)}
                            >
                              -
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateData;
