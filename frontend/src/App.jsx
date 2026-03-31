import { useEffect, useState } from 'react';
import { Canvas3D } from './components/Canvas3D';
import UploadHero from './components/UploadHero';
import ResultsDashboard from './components/ResultsDashboard';
import { useECGStore } from './hooks/useStore';
import { checkHealth } from './utils/api';
import './styles/tokens.css';
import './styles/accessibility.css';
import './styles/components.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const aiReview = useECGStore((state) => state.aiReview);
  const showWarning = useECGStore((state) => state.showArrhythmiaWarning);
  const recommendations = useECGStore((state) => state.recommendations);

  useEffect(() => {
    // Check backend health
    checkHealth().then((status) => {
      setBackendStatus(status.model_loaded ? 'online' : 'offline');
    }).catch(() => {
      setBackendStatus('offline');
    });
  }, []);

  const handleUploadResult = (result) => {
    setAnalysisResult(result);
    setActiveTab('results');
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveTab('upload');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0F1419', color: '#d1d5db' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 20, 25, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>❤️</div>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#06B6D4',
                margin: 0,
              }}>HeartSafe AI</h1>
              <p style={{
                fontSize: '11px',
                color: '#9CA3AF',
                margin: '2px 0 0 0',
              }}>Clinical ECG Analysis Platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              {['home', 'upload', 'results', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === tab ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: activeTab === tab ? '#06B6D4' : 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: backendStatus === 'online' ? '#10B981' : '#EF4444',
                }}
              />
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {backendStatus === 'online' ? 'Backend Online' : 'Backend Offline'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        {/* Home Tab - Hero with 3D */}
        {activeTab === 'home' && (
          <div>
            <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
              <Canvas3D />

              {/* Warning */}
              {showWarning && (
                <div style={{
                  position: 'absolute',
                  top: '32px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 20,
                  padding: '12px 24px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <span style={{ color: '#EF4444', fontWeight: '600' }}>⚠️ Arrhythmia Detected</span>
                </div>
              )}

              {/* AI Review Panel */}
              {aiReview && (
                <div style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: '32px',
                  width: '384px',
                  zIndex: 10,
                  padding: '24px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxHeight: '192px',
                  overflowY: 'auto',
                }}>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0 }}>
                    <span style={{ fontWeight: '600', color: '#06B6D4' }}>AI Review:</span> {aiReview}
                  </p>
                </div>
              )}

              {/* Recommendations Panel */}
              {recommendations.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '32px',
                  right: '32px',
                  width: '384px',
                  zIndex: 10,
                  padding: '24px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxHeight: '192px',
                  overflowY: 'auto',
                }}>
                  <p style={{ fontSize: '14px', color: '#d1d5db', marginBottom: '16px', margin: 0 }}>
                    <span style={{ fontWeight: '600', color: '#06B6D4' }}>Recommendations:</span>
                  </p>
                  <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                    {recommendations.map((rec, idx) => (
                      <li key={idx} style={{ fontSize: '14px', color: '#d1d5db', display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ color: '#06B6D4', marginRight: '12px' }}>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trust Section */}
            <div style={{
              padding: '80px 32px',
              background: 'linear-gradient(to bottom, #0F1419, rgba(15, 20, 25, 0.5))',
            }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <h2 style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '48px',
                  color: '#06B6D4',
                }}>
                  Clinical Excellence
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}>
                  {[
                    { label: '87,000+ ECG Beats Analyzed', icon: '📊' },
                    { label: 'Clinical-grade Accuracy', icon: '✓' },
                    { label: 'Real-time Detection', icon: '⚡' }
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                      <p style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '500', margin: 0 }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div style={{ minHeight: '100vh', padding: '80px 32px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <UploadHero onResult={handleUploadResult} onError={handleUploadError} />
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && analysisResult && (
          <div style={{ minHeight: '100vh', padding: '80px 32px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <ResultsDashboard result={analysisResult} onReset={handleReset} />
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{ minHeight: '100vh', padding: '80px 32px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '30px',
                fontWeight: 'bold',
                marginBottom: '32px',
                color: '#06B6D4',
              }}>About HeartSafe AI</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{
                  padding: '32px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#06B6D4', marginBottom: '16px' }}>Our Mission</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0 }}>
                    HeartSafe AI is a clinical-grade ECG analysis platform powered by advanced machine learning. We provide real-time cardiac rhythm detection and arrhythmia identification to help healthcare professionals make informed decisions quickly and accurately.
                  </p>
                </div>

                <div style={{
                  padding: '32px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#06B6D4', marginBottom: '16px' }}>Key Features</h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Real-time ECG analysis with 95%+ accuracy',
                      'Instant arrhythmia detection and classification',
                      'Clinical-grade validation and compliance',
                      'Comprehensive patient recommendations',
                      'Secure data handling and HIPAA compliance'
                    ].map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#d1d5db' }}>
                        <span style={{ color: '#06B6D4', marginTop: '4px' }}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  padding: '32px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#06B6D4', marginBottom: '16px' }}>Technology Stack</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                  }}>
                    {[
                      { label: 'Frontend', value: 'React + Three.js + Tailwind' },
                      { label: 'Backend', value: 'FastAPI + PyTorch' },
                      { label: 'Model', value: '1D CNN (87K+ ECG samples)' },
                      { label: 'Accuracy', value: '95%+ Clinical Grade' }
                    ].map((tech, idx) => (
                      <div key={idx} style={{
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}>
                        <p style={{ color: '#06B6D4', fontWeight: '600', margin: 0 }}>{tech.label}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0 0' }}>{tech.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 20, 25, 0.5)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>© 2026 HeartSafe AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#06B6D4'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
