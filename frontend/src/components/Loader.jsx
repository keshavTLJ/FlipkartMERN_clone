
const Loader = ({ size="40px", borderWidth = "4px", style = {} }) => {
  return (
    <div className="flex justify-center items-center" style={style}>
      <div
        className="animate-spin rounded-full border-t-transparent border-blue-500 border-solid rounder-full"
        style={{ width:size, height:size, borderWidth }}
      ></div>
    </div>
  );
};

export default Loader;