import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  
  // State aplikasi
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Kontrol buka/tutup kamera
  const [kameraBelakang, setKameraBelakang] = useState(true);
  const [struk, setStruk] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi memutar arah kamera
  const putarKamera = useCallback(() => {
    setKameraBelakang((sebelumnya) => !sebelumnya);
  }, []);

  // Fungsi membuka/menutup kamera
  const toggleKamera = () => {
    setIsCameraOpen(!isCameraOpen);
    setStruk(null); // Bersihkan struk jika kamera ditutup
  };

  // Fungsi memotret dan mengirim ke AI
  const captureDanHitung = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("Kamera belum siap!");

    setLoading(true);
    setStruk(null);

    try {
      // Ganti alamat localhost lama kamu menjadi seperti ini:
const response = await fetch("https://be-seblak-lens-nikv.vercel.app/hitung-seblak", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ gambar: gambarBase64 }),
});
      setStruk(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghubungi AI. Pastikan server Python menyala!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.appCard}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>🔥SeblakLens</h1>
          <p style={styles.subtitle}>Semangkuk Seblak Sebelum Mati</p>
        </div>
        
        {/* Tampilan Utama (Kamera Mati) */}
        {!isCameraOpen ? (
          <div style={styles.welcomeContainer}>
            <div style={styles.iconBesar}>🍲</div>
            <h3 style={{ color: "#2c3e50" }}>Unggah Semangkuk Seblak</h3>
            <p style={{ color: "#7f8c8d", fontSize: "14px", marginBottom: "20px" }}>
              Tekan tombol di bawah untuk menyalakan pemindai AI.
            </p>
            <button onClick={toggleKamera} style={styles.openCameraButton}>
              📷 SCAN SEBLAK
            </button>
          </div>
        ) : (
          /* Tampilan Kasir (Kamera Menyala) */
          <>
            <div style={styles.cameraContainer}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={styles.camera}
                videoConstraints={{
                  facingMode: kameraBelakang ? "environment" : "user"
                }}
              />
              <div style={styles.cameraBadge}>
                Live Cam 🟢 ({kameraBelakang ? "Belakang" : "Depan"})
              </div>
              
              <button onClick={putarKamera} style={styles.flipButton}>
                🔄 Putar
              </button>
            </div>
            
            <div style={styles.actionButtons}>
              <button onClick={toggleKamera} style={styles.closeCameraButton}>
                ❌ Tutup
              </button>
              <button 
                onClick={captureDanHitung} 
                disabled={loading}
                style={{
                  ...styles.calculateButton,
                  background: loading ? "#bdc3c7" : "linear-gradient(135deg, #ff416c, #ff4b2b)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "⏳ Meracik Harga..." : "📸 SCAN SEBLAK"}
              </button>
            </div>
          </>
        )}

        {/* Receipt / Struk Section */}
        {struk && struk.status === "sukses" && (
          <div style={styles.receiptCard}>
            <div style={styles.receiptHeader}>
              <h2 style={styles.receiptTitle}>🧾 STRUK PEMBELIAN</h2>
              <p style={styles.receiptDate}>{new Date().toLocaleString('id-ID')}</p>
            </div>
            
            <div style={styles.divider}></div>
            
            {struk.keranjang.length > 0 ? (
              <ul style={styles.itemList}>
                {struk.keranjang.map((item, index) => (
                  <li key={index} style={styles.itemRow}>
                    <div>
                      <span style={styles.itemName}>{item.nama.toUpperCase()}</span>
                      <br/>
                      <span style={styles.itemQty}>x{item.jumlah}</span>
                    </div>
                    <strong style={styles.itemPrice}>Rp {item.subtotal.toLocaleString('id-ID')}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "30px" }}>🕵️‍♂️</span>
                <p>Waduh, AI tidak menemukan toping seblak di gambar ini.</p>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>TOTAL BAYAR</span>
              <span style={styles.totalPrice}>Rp {struk.total_harga.toLocaleString('id-ID')}</span>
            </div>
            
            <p style={styles.receiptFooter}>Terima kasih orang baik! Makan seblak bikin hepi 🌶️</p>
          </div>
        )}
      </div>
    </div>
  );
}

// === KUMPULAN GAYA DESAIN (CSS IN JS) ===
const styles = {
  pageBackground: {
    backgroundColor: "#fff3e0",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  appCard: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "480px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(211, 84, 0, 0.15)",
    padding: "30px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "25px",
  },
  title: {
    color: "#d32f2f",
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: {
    color: "#e67e22",
    margin: "0",
    fontSize: "14px",
    fontWeight: "600",
  },
  
  // Tampilan Selamat Datang (Kamera Mati)
  welcomeContainer: {
    textAlign: "center",
    padding: "30px 10px",
    backgroundColor: "#fafafa",
    borderRadius: "16px",
    border: "2px dashed #ffcc80",
  },
  iconBesar: {
    fontSize: "60px",
    marginBottom: "10px",
  },
  openCameraButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#27ae60",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
    transition: "transform 0.2s",
  },

  // Tampilan Kamera Nyala
  cameraContainer: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    border: "4px solid #ffcc80",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
    marginBottom: "15px",
    backgroundColor: "#000",
  },
  camera: {
    width: "100%",
    display: "block",
  },
  cameraBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#2ecc71",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  flipButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "none",
    color: "#d32f2f",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  
  // Tombol Aksi saat Kamera Nyala
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  closeCameraButton: {
    flex: "1",
    padding: "16px",
    backgroundColor: "#e74c3c",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  calculateButton: {
    flex: "2",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
  },

  // Tampilan Struk
  receiptCard: {
    marginTop: "25px",
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #eeeeee",
  },
  receiptHeader: {
    textAlign: "center",
  },
  receiptTitle: {
    margin: "0",
    fontSize: "18px",
    color: "#333",
    fontWeight: "bold",
  },
  receiptDate: {
    margin: "5px 0 0 0",
    fontSize: "12px",
    color: "#888",
  },
  divider: {
    height: "1px",
    borderBottom: "2px dashed #cccccc",
    margin: "15px 0",
  },
  itemList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  itemName: {
    fontWeight: "bold",
    color: "#2c3e50",
    fontSize: "15px",
  },
  itemQty: {
    color: "#7f8c8d",
    fontSize: "13px",
  },
  itemPrice: {
    color: "#2c3e50",
    fontSize: "16px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "900",
    color: "#d32f2f",
  },
  totalPrice: {
    fontSize: "24px",
  },
  emptyState: {
    textAlign: "center",
    color: "#e74c3c",
    padding: "10px",
    fontWeight: "bold",
  },
  receiptFooter: {
    textAlign: "center",
    fontSize: "12px",
    color: "#95a5a6",
    marginTop: "20px",
    fontStyle: "italic",
  }
};

export default App;