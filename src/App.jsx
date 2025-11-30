import { useState } from 'react';
import './App.css';

function App() {
  // State data komentar
  // Kita tambahkan properti 'position' (opsional) untuk menyimpan koordinat pin
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Muhammad Rafi Putra Suryawan",
      time: "Baru saja",
      text: "Poninya bagus yah.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi",
      position: { x: 350, y: 150 } // Contoh komentar yang sudah ada pin-nya
    }
  ]);

  const [sidebarInput, setSidebarInput] = useState("");
  const [activePoint, setActivePoint] = useState(null); // {x, y} sementara saat input
  const [tempComment, setTempComment] = useState("");

  // Handler klik gambar
  const handleImageClick = (e) => {
    // Mencegah klik saat user klik pin yang sudah ada atau form input
    if (e.target.closest('.floating-comment-box') || e.target.closest('.saved-pin')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setActivePoint({ x, y });
    setTempComment(""); 
  };

  // Submit dari Floating Box (Gambar)
  const submitFloatingComment = (e) => {
    e.preventDefault();
    if (!tempComment.trim()) return;

    // KITA KIRIM KOORDINAT (activePoint) KE FUNGSI PENAMBAH KOMENTAR
    addNewComment(tempComment, activePoint);
    
    setActivePoint(null);
    setTempComment("");
  };

  // Submit dari Sidebar
  const submitSidebarComment = (e) => {
    e.preventDefault();
    if (!sidebarInput.trim()) return;

    // Komentar dari sidebar tidak punya posisi (null)
    addNewComment(sidebarInput, null);
    setSidebarInput("");
  };

  // Helper: Menambah komentar
  // Menerima parameter kedua 'pos' (position)
  const addNewComment = (text, pos = null) => {
    const newComment = {
      id: Date.now(),
      name: "User Tamu",
      time: "Baru saja",
      text: text,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      position: pos // Simpan koordinat di sini (bisa null jika dari sidebar)
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="container">
      
      <main className="main-content">
        <div className="image-card">
          <div className="card-header">
            <h3>iMy design</h3>
          </div>
          
          <div className="image-wrapper" onClick={handleImageClick}>
            <img 
              src="https://i.pinimg.com/736x/60/a2/2e/60a22e1f2e1d37087253924376466a55.jpg" 
              alt="Design Preview" 
              className="main-image"
            />

            {/* --- BAGIAN BARU: RENDER PIN YANG SUDAH DISIMPAN --- */}
            {comments.map((comment) => (
              comment.position && (
                <div 
                  key={comment.id}
                  className="saved-pin"
                  style={{ top: comment.position.y, left: comment.position.x }}
                  title={comment.text} // Tooltip bawaan browser
                >
                  <img src={comment.avatar} alt="user" />
                  
                  {/* Tooltip Custom (Opsional: Muncul saat hover pin) */}
                  <div className="pin-tooltip">
                    <strong>{comment.name}</strong>
                    <p>{comment.text}</p>
                  </div>
                </div>
              )
            ))}

            {/* INPUT BOX SEMENTARA (Saat baru klik) */}
            {activePoint && (
              <div 
                className="floating-comment-box"
                style={{ top: activePoint.y, left: activePoint.x }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pin-indicator-temp"></div>
                <form onSubmit={submitFloatingComment}>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Tulis komentar..." 
                    value={tempComment}
                    onChange={(e) => setTempComment(e.target.value)}
                  />
                  <div className="floating-actions">
                    <button type="button" onClick={() => setActivePoint(null)} className="cancel-btn">Batal</button>
                    <button type="submit" className="submit-btn">Kirim</button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Komentar ({comments.length})</h3>
        </div>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img src={comment.avatar} alt="avatar" className="avatar" />
              <div className="comment-content">
                <div className="comment-meta">
                  <span className="username">{comment.name}</span>
                  <span className="time">{comment.time}</span>
                  {/* Indikator kecil jika komentar ini ada di gambar */}
                  {comment.position && <span className="pin-badge">📌</span>}
                </div>
                <p className="comment-text">{comment.text}</p>
                <button className="reply-btn">Balas ...</button>
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <form onSubmit={submitSidebarComment} className="input-wrapper">
            <input 
              type="text" 
              placeholder="Balas umum ..." 
              value={sidebarInput}
              onChange={(e) => setSidebarInput(e.target.value)}
            />
            <button type="submit" className="send-btn">
               SEND
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}

export default App;