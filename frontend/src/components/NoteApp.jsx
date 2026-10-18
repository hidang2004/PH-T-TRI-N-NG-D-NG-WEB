import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notes';

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Lỗi khi tải ghi chú:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, { title, content });
      setNotes([response.data, ...notes]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Lỗi khi thêm ghi chú:', error);
    }
  };

  // Hàm xử lý xóa ghi chú
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      // Lọc bỏ ghi chú bị xóa khỏi state để cập nhật giao diện ngay lập tức mà không cần reload
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa ghi chú:', error);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header Banner */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>✨ Note Master</div>
          <h1 style={styles.headerTitle}>Quản Lý Ghi Chú Thông Minh</h1>
          <p style={styles.headerSubtitle}>Ghi lại nhanh chóng - Lưu trữ an toàn - Truy xuất mọi lúc</p>
        </header>

        {/* Form thêm mới */}
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <div style={styles.formHeaderRow}>
            <h3 style={styles.formTitle}>✍️ Tạo ghi chú mới</h3>
            <span style={styles.badgeCount}>{notes.length} ghi chú</span>
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Tiêu đề ghi chú (Bắt buộc)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <textarea
              placeholder="Nhập nội dung chi tiết của bạn vào đây..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="3"
              style={styles.textarea}
            />
          </div>
          
          <button type="submit" style={styles.submitButton}>
            🚀 Thêm Ghi Chú Ngay
          </button>
        </form>

        {/* Danh sách ghi chú */}
        <div style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.listHeading}>📂 Danh Sách Ghi Chú</h3>
          </div>

          {loading ? (
            <div style={styles.centerBox}>
              <p style={{ color: '#64748b' }}>Đang đồng bộ dữ liệu...</p>
            </div>
          ) : notes.length === 0 ? (
            <div style={styles.emptyCard}>
              <span style={{ fontSize: '32px' }}>📝</span>
              <p style={{ color: '#64748b', marginTop: '10px', fontWeight: '500' }}>Chưa có ghi chú nào được tạo.</p>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Hãy thử tạo ghi chú đầu tiên ở khung phía trên nhé!</span>
            </div>
          ) : (
            <div style={styles.gridContainer}>
              {notes.map((note, index) => (
                <div key={note._id || index} style={styles.noteCard}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.noteTitle}>{note.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {note.isPinned && <span style={styles.pinBadge}>📌 Đã ghim</span>}
                      {/* Nút Xóa ghi chú */}
                      <button 
                        onClick={() => handleDelete(note._id)} 
                        style={styles.deleteButton}
                        title="Xóa ghi chú này"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                  <p style={styles.noteContent}>{note.content || 'Không có nội dung chi tiết.'}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.dateText}>
                      🕒 {new Date(note.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Bảng cấu hình giao diện
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    padding: '40px 15px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '35px',
  },
  logoBadge: {
    display: 'inline-block',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  formCard: {
    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    marginBottom: '35px',
    border: '1px solid #e2e8f0',
  },
  formHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  badgeCount: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  listSection: {
    marginTop: '20px',
  },
  sectionHeader: {
    marginBottom: '16px',
  },
  listHeading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  centerBox: {
    textAlign: 'center',
    padding: '40px',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: '45px 20px',
    textAlign: 'center',
    borderRadius: '16px',
    border: '2px dashed #cbd5e1',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noteCard: {
    backgroundColor: '#ffffff',
    padding: '22px',
    borderRadius: '14px',
    boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    borderLeft: '5px solid #4f46e5',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  noteTitle: {
    fontSize: '18px',
    color: '#0f172a',
    margin: 0,
    fontWeight: '700',
  },
  pinBadge: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  noteContent: {
    fontSize: '15px',
    color: '#334155',
    margin: '0 0 16px 0',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  cardFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '12px',
  },
  dateText: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
};

export default NoteApp;