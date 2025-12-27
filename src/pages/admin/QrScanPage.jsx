import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../services/api';
import {
  CheckCircleIcon, XCircleIcon, CalendarDaysIcon, ClockIcon, UserIcon, XMarkIcon, CameraIcon, ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import StatusIcon from './StatusIcon'; 
import './StatusIcon.css'; 

let audioContext = null;
const getAudioContext = () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
};

const playBeep = (freq = 800, dur = 200, type = 'sine') => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur / 1000);
    osc.start();
    osc.stop(ctx.currentTime + dur / 1000);
  } catch (e) {}
};

const vibrate = (pattern) => 'vibrate' in navigator && navigator.vibrate(pattern);

const triggerPendingFeedback = () => {
    vibrate(100);
    playBeep(900, 100, 'sine');
};

const triggerSuccessFeedback = () => {
  vibrate([200, 100, 200]);
  playBeep(1200, 150, 'square');
  setTimeout(() => playBeep(1500, 200, 'square'), 200);
};

const triggerErrorFeedback = () => {
  vibrate(500);
  playBeep(300, 600, 'sawtooth');
};

const QrScanPage = () => {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const isScanning = useRef(false);
  const isConfirming = useRef(false);
  const autoCloseTimeout = useRef(null);

  const [modalState, setModalState] = useState({
    show: false,
    type: null, 
    booking: null,
    scanResult: null,
    error: { title: '', desc: '' },
    scannedCode: '',
    selectedCount: 1,
    scannerKey: 0,
  });

  const { show, type, booking, scanResult, error, scannedCode, selectedCount, scannerKey } = modalState;

  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);



  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      scannerRef.current = null;
      return true;
    }
    return false;
  }, []);

  const startScanner = useCallback(async (cameraId) => {
    
    if (!containerRef.current) return;
    await stopScanner(); 

    const idToUse = cameraId || currentCameraId;
    if (!idToUse) return;

    const scanner = new Html5Qrcode('qr-reader');
    try {
      await scanner.start(
        idToUse,
        { 
          fps: 8, 
          qrbox: { width: 260, height: 260 }, 
          aspectRatio: 1 
        },
        (decodedText) => {
          if (isScanning.current || modalState.show) return; 
          isScanning.current = true;
          handleScan(decodedText).finally(() => {
            isScanning.current = false;
          });
        },
        () => {}
      );
      scannerRef.current = scanner;
    } catch (err) {
      console.error('Camera error during start:', err);
    }
  }, [stopScanner, currentCameraId, modalState.show]);



  const handleScan = async (code) => {
    const qr = code.trim();
    if (!qr) return;

    await stopScanner(); 

    setModalState(prev => ({
      ...prev,
      show: true,
      type: 'pending',
      scannedCode: qr,
      booking: null,
      error: { title: '', desc: '' },
      selectedCount: 1,
    }));

    try {
      const res = await api.post('/bookings/check-qr', { qrCode: qr });

      setModalState(prev => ({
        ...prev,
        booking: res.data.data.booking,
        type: 'pending',
      }));

      triggerPendingFeedback(); 

    } catch (err) {
      const title = err.response?.data?.message || 'Invalid QR Code';
      const desc = err.response?.data?.reason || '';

      setModalState(prev => ({
        ...prev,
        type: 'error',
        error: { title, desc },
      }));

      triggerErrorFeedback();

      autoCloseTimeout.current = setTimeout(() => {
        closeModal();
      }, 3000);
    }
  };

  const confirmEntry = async () => {
    if (isConfirming.current || !scannedCode) return;
    isConfirming.current = true;

    try {
      const res = await api.post('/bookings/scan-qr', {
        qrCode: scannedCode,
        count: selectedCount,
        location: 'Main Gate',
        notes: `Group entry: ${selectedCount} person(s)`,
      });

      setModalState(prev => ({
        ...prev,
        type: 'success',
        scanResult: res.data,
        booking: null,
      }));

      triggerSuccessFeedback();

      autoCloseTimeout.current = setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (err) {
      const title = err.response?.data?.message || 'Scan failed';
      const desc = err.response?.data?.reason || '';

      setModalState(prev => ({
        ...prev,
        type: 'error',
        error: { title, desc },
        booking: null,
        scanResult: null,
      }));

      triggerErrorFeedback();

      autoCloseTimeout.current = setTimeout(() => {
        closeModal();
      }, 3000);

    } finally {
      isConfirming.current = false;
    }
  };

  const closeModal = useCallback(() => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
      autoCloseTimeout.current = null;
    }

    setModalState(prev => ({
      show: false,
      type: null,
      booking: null,
      scanResult: null,
      error: { title: '', desc: '' },
      scannedCode: '',
      selectedCount: 1,
      scannerKey: prev.scannerKey + 1,
    }));
  }, []);

  const toggleCamera = async () => {
    if (availableCameras.length < 2) return;
    await stopScanner();
    const nextIdx = (availableCameras.findIndex(c => c.id === currentCameraId) + 1) % availableCameras.length;
    const nextCamId = availableCameras[nextIdx].id;
    setCurrentCameraId(nextCamId);
  };

  useEffect(() => {
    const initCameras = async () => {
      try {
        const cams = await Html5Qrcode.getCameras();
        setAvailableCameras(cams);
        if (cams.length === 0) throw new Error('No camera');
        const frontCam = cams.find(c => c.label.toLowerCase().includes('front')) || cams[0];
        setCurrentCameraId(frontCam.id);
      } catch (err) {
        console.error('Initial Camera error:', err);
      }
    };
    initCameras();
  }, []);

  useEffect(() => {
    if (currentCameraId && !show) {
      startScanner(currentCameraId);
    }
    return () => {
      stopScanner();
      if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
    };
  }, [currentCameraId, scannerKey, startScanner, stopScanner, show]);



  const renderBookingInfo = (b) => (
    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-left space-y-2 border">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-900">{b.event.title}</h3>
      <p className="text-[11px] sm:text-xs text-slate-600 flex flex-wrap items-center gap-1.5">
        <CalendarDaysIcon className="w-3.5 h-3.5" />
        {new Date(b.event.startDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        <span className="inline-flex items-center gap-1 ml-1.5">
          <ClockIcon className="w-3.5 h-3.5" />
          {new Date(b.event.startDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </p>
      <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700">
        <UserIcon className="w-3.5 h-3.5" />
        {b.user.firstName} {b.user.lastName}
      </p>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
        <header className="bg-white shadow-sm border-b border-slate-200 px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Gate Entry</p>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900">QR Scanner</h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {availableCameras.length > 1 && (
                <button onClick={toggleCamera} className="p-1.5 sm:p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition">
                  <ArrowsRightLeftIcon className="w-4 h-4 text-emerald-700" />
                </button>
              )}
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-3 pb-16">
          <div className="w-full max-w-sm sm:max-w-md">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden border border-slate-200">
              <div className="text-center py-3 sm:py-4 bg-gradient-to-b from-slate-50 to-white">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Scan QR Code</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Align code inside the frame</p>
              </div>
              <div className="relative bg-black">
                {}
                <div id="qr-reader" key={scannerKey} ref={containerRef} className="w-full aspect-square" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 sm:w-64 sm:h-64 border-4 border-emerald-500 rounded-2xl" />
                  <div className="absolute w-52 h-52 sm:w-64 sm:h-64 border-4 border-emerald-400 rounded-2xl animate-ping opacity-70" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-4 bg-black/55">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5">
              <button onClick={closeModal} className="absolute top-2.5 right-2.5 p-1.5 rounded-full hover:bg-slate-100">
                <XMarkIcon className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {}
              {type === 'pending' && booking ? (
                <div className="text-center space-y-4 sm:space-y-5">
                  <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mx-auto" />
                  <h2 className="text-sm sm:text-base font-semibold text-emerald-600">Valid Booking</h2>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">ID: {booking.bookingId}</p>

                  {renderBookingInfo(booking)}

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{booking.remainingScans}</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1">Entries remaining</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm font-medium text-slate-800">How many people are entering now?</p>
                    <select
                      value={selectedCount}
                      onChange={(e) => setModalState(p => ({ ...p, selectedCount: Number(e.target.value) }))}
                      className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-center bg-emerald-100 border border-emerald-400 rounded-xl focus:outline-none"
                    >
                      {Array.from({ length: booking.remainingScans }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={confirmEntry}
                      disabled={isConfirming.current}
                      className="w-full h-9 sm:h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center relative overflow-hidden transition-all"
                    >
                      <span className="relative z-10">
                        {isConfirming.current ? 'Processing...' : `Mark Entry × ${selectedCount}`}
                      </span>
                      {isConfirming.current && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              {}
              {type === 'success' && scanResult ? (
                <div className="text-center py-8 sm:py-10 space-y-4 sm:space-y-5">
                  <center>
                    <StatusIcon status="success" size={80} />
                  </center>
                  <h2 className="text-sm sm:text-base font-semibold text-emerald-600">
                    {scanResult.data.justScanned} entry(s) marked
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">
                    {scanResult.data.remainingScans} remaining
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 animate-pulse"> Ready for next scan... </p>
                </div>
              ) : null}

              {}
              {type === 'error' ? (
                <div className="text-center py-8 sm:py-10 space-y-4 sm:space-y-5">
                  <center>
                    <StatusIcon status="error" size={80} />
                  </center>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-red-600">
                    {error.title}
                  </h2>
                  {error.desc && (
                    <p className="text-[11px] sm:text-xs text-red-600 px-3">{error.desc}</p>
                  )}
                  <button
                    onClick={closeModal}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : null}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QrScanPage;
