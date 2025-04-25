// src/components/Spinner.jsx
const Spinner = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60 z-50">
        <div className="w-14 h-14 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default Spinner;
  