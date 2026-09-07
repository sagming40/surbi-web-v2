function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface font-sans">
      <p className="text-label text-sub">라벨 텍스트 (10px)</p>
      <h1 className="text-3xl font-bold text-navy">
        Surbi (디자인 토큰 연결 확인)
      </h1>
      <p className="text-headline text-blue">
        485억 원 · 전분기 대비 +12.4%
      </p>
      <div className="px-3 py-2 rounded-md border border-warn-line bg-warn-bg text-warn text-caption">
        ⚠️ DB 확인 중
      </div>
    </div>
  )
}

export default App
