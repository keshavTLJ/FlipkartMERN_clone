
const Loader = ({ width = "40px", height = "40px", borderWidth = "4px", style = {} }) => {
  return (
    <div className="flex justify-center items-center" style={style}>
      <div
        className="animate-spin rounded-full border-t-transparent border-blue-500 border-solid rounder-full"
        style={{ width, height, borderWidth }}
      ></div>
    </div>
  );
};

export default Loader;