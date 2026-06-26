export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return (
    <main style={{ overflow: 'hidden', height: '100vh' }}>
      <iframe
        src={`${basePath}/legacy-app.html`}
        title="MohiKov App"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      />
    </main>
  );
}
