const UserCaseCard = ({ report }) => {
  return (
    <div
      key={report._id}
      className="flex flex-col mb-10 px-8 py-8 sm:flex-row sm:justify-between rounded-xl bg-white text-black  backdrop-blur-lg bg-opacity-40"
    >
      <div className="flex w-full space-x-2 sm:space-x-4">
        <div className="flex flex-col w-full justify-between pb-4">
          <div className="flex w-full justify-between space-x-2 pb-2">
            <div className="space-y-4">
              <h3 className="font-semibold leading-snug sm:pr-8 text-2xl">
                {report.title}
              </h3>
              {/* <p className="text-lg p-2">{report.color}</p> */}
            </div>
          </div>
          <div className="flex items-center space-x-10 mt-5 p-2">
            <div className="flex flex-grow items-center justify-between px-10">
              <div>{report.description}</div>
              <div>
                <img
                  className="rounded-md"
                  src={report.image}
                  alt="Report Image"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    margin: "0 auto",
                  }}
                />
              </div>
            </div>
          </div>
              <div className="flex gap-3"><div className="font-bold text-[#3b191979]">Current Status: </div>{report.status}</div>
        </div>
      </div>
    </div>
  );
};

export default UserCaseCard;
