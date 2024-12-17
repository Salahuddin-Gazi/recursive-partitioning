import { Fragment } from 'react';

export default function MainComponent({ firstComponent = true, children = [], direction = 'row', onClick, color }) {
  return (
    <div
      className={`h-full w-full flex flex-1 justify-center items-center relative`}
      style={{backgroundColor: color}}
    >
      <div className="flex justify-center items-center gap-x-1">
        <button
          className="px-2 border bg-white flex justify-center items-center w-[26px] h-[28px]"
          onClick={onClick}
        >
          V
        </button>
        <button
          className="px-2 border bg-white flex justify-center items-center w-[26px] h-[28px]"
          onClick={onClick}
        >
          H
        </button>
        {!firstComponent && (
          <button
            className="px-2 border bg-white flex justify-center items-center w-[26px] h-[28px]"
            id="minus"
            onClick={onClick}
          >
            <span className="bg-slate-800 w-[16px] h-[1.5px] block"></span>
          </button>
        )}
      </div>
      {children.length > 0 && (
        <div
          className={`flex flex-${direction} justify-center items-center absolute left-0 top-0 w-full h-full bg-white`}
          style={{ flexDirection: direction }}
        >
          {children.map((child, index) => (
            <Fragment key={child.id || index}>{child}</Fragment> // Use a unique identifier like `id`
          ))}
        </div>
      )}
    </div>
  );
}
