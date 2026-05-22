function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1A1A2E]">404</h1>
        <p className="text-xl text-[#6B7280] mt-4">Página no encontrada</p>
        <a href="/inicio" className="mt-6 inline-block px-6 py-3 bg-[#1A1A2E] text-white rounded-lg">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
export default NotFoundPage;