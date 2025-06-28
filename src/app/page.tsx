export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">System font</h1>
      <h1 className="font-logo text-4xl text-red-500 border border-green-500">
        Should be Bacalar
      </h1>
      <h1 style={{ fontFamily: 'Bacalar, sans-serif' }} className="text-4xl text-blue-500">
        Inline style Bacalar
      </h1>
    </div>
  );
}
