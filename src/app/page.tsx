export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, var(--background), #FCE4EC)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '1rem',
          color: 'var(--primary-dark)',
          letterSpacing: '0.05em'
        }}>
          健康美人
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          marginBottom: '3rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          40代から始める、自分らしい健康生活。<br />
          毎日の食事と運動を記録して、いつまでも輝くあなたへ。
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            はじめる
          </button>
          <button className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            ログイン
          </button>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        opacity: 0.6,
        fontSize: '0.9rem',
        color: 'var(--text-light)'
      }}>
        © 2026 Health Beauty. All rights reserved.
      </div>
    </main>
  );
}
