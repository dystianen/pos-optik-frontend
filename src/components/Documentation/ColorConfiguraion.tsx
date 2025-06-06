export const ColorConfiguration = () => {
  return (
    <>
      <h3 className=" text-xl font-semibold mt-8 text-black">Colors</h3>
      <div className="p-6 rounded-md border mt-4 border-dark_border border-opacity-60">
        <p className="text-base font-medium text-muted text-opacity-60">
          <span className="font-semibold text-lg text-black">
            1. Override Colors
          </span>{" "}
          <br />
          For any change in colors : tailwind.config.ts
        </p>
        <div className="py-4 px-5 rounded-md bg-dark_grey mt-8">
          <p className="text-sm text-black/60 flex flex-col gap-2">
            <span>primary: "#6556ff",</span>
            <span>secondary: "#1a21bc",</span>
            <span>grey: "#57595f",</span>
            <span>slateGray: "#f6faff",</span>
            <span>deepSlate: "#d5effa",</span>
            <span>success: "#43c639",</span>
            <span>midnight_text: "#222c44",</span>
          </p>
        </div>
      </div>
      <div className="p-6 rounded-md border mt-4 border-dark_border border-opacity-60">
        <p className="text-base font-medium text-muted text-opacity-60">
          <span className="font-semibold text-lg text-black">
            2. Override Theme Colors
          </span>{" "}
          <br />
          For change , go to : tailwind.config.ts
        </p>
        <div className="py-4 px-5 rounded-md bg-dark_grey mt-8">
          <p className="text-sm text-black/60 flex flex-col gap-2">
            <span>primary: "#6556ff",</span>
            <span>secondary: "#1a21bc",</span>
          </p>
        </div>
      </div>
    </>
  );
};
