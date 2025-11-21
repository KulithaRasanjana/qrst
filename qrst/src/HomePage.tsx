const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Q R S T
      </h1>

      <p className="text-gray-600 text-lg mb-6 text-center max-w-xl">
      </p>

      <a
        href="/call"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Video Call
      </a>
    </div>
  );
};

export default HomePage;