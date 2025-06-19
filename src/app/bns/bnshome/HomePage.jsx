// components/HomePage.js
export default function HomePage({ legalData }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Legal Sections</h1>
      {legalData.map((item) => (
        <div key={item._id} className="border p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">{item.section}</h2>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </div>
      ))}
    </div>
  );
}
