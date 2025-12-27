const QRModal = ({ booking, onClose }) => {
  const [sending, setSending] = useState(false);

  if (!booking) return null;

  const memberName = booking.memberName || 'Member';
  const memberId = booking.memberIdInput || booking.memberId || 'N/A';
  const contactNumber = booking.contactNumber || '';
  const eventTitle = booking.event?.title || 'Event';
  const utr = booking.utrNumber || 'Pending';

  const totalVeg = (booking.memberVegCount || 0) + (booking.guestVegCount || 0) + (booking.kidVegCount || 0);
  const totalNonVeg = (booking.memberNonVegCount || 0) + (booking.guestNonVegCount || 0) + (booking.kidNonVegCount || 0);

  const qrData = JSON.stringify({
    id: booking.bookingId,
    name: memberName,
    memberId: memberId,
    event: eventTitle,
    tickets: `M:${booking.memberTicketCount} G:${booking.guestTicketCount} K:${booking.kidTicketCount}`,
    meals: `Veg:${totalVeg} | Non-Veg:${totalNonVeg}`,
    amount: booking.finalAmount,
    status: booking.paymentStatus.toUpperCase(),
    utr: utr
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(qrData)}`;

  const message = `Hello *${memberName}*!

Your ticket is confirmed!

*Booking ID:* #${booking.bookingId}
*Event:* ${eventTitle}
*Tickets:* ${booking.memberTicketCount} Member + ${booking.guestTicketCount} Guest + ${booking.kidTicketCount} Kid
*Meals:* Veg: ${totalVeg} | Non-Veg: ${totalNonVeg}
*Final Amount:* ₹${booking.finalAmount}
*Status:* ${booking.paymentStatus.toUpperCase()}
*UTR:* ${utr}

Please show this QR code at the entrance for check-in.

Thank you!
SRS Events Team`;

  const sendViaWhatsApp = async () => {
    setSending(true);

    let phone = contactNumber.replace(/[^0-9]/g, '');
    if (!phone) {
      toast.error('Contact number missing!');
      setSending(false);
      return;
    }
    if (phone.length === 10) phone = '91' + phone;
    if (phone.length === 12 && phone.startsWith('91')) phone = phone; // already good
    else if (phone.length === 11 && phone.startsWith('0')) phone = '91' + phone.slice(1);

    try {
      // Step 1: Convert QR to base64
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;

        // Step 2: Create WhatsApp URL with image + text
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp Web/Mobile with pre-filled message
        window.open(whatsappUrl, '_blank');

        // Small delay to allow WhatsApp to open, then trigger image copy (desktop only)
        setTimeout(() => {
          // Create temporary image to copy to clipboard
          const img = new Image();
          img.src = base64data;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]);
              toast.success('QR Code copied! Paste it in WhatsApp chat');
            });
          };
        }, 1000);

        setSending(false);
      };
    } catch (err) {
      toast.error('Failed to prepare QR');
      setSending(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `Ticket_${booking.bookingId}_${memberName}.png`;
    link.click();
    toast.success('QR Downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-3xl max-w-2xl w-full p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-5xl text-gray-400 hover:text-red-600 transition">&times;</button>

        <h2 className="text-4xl font-bold text-center mb-8 text-green-600">
          Share Booking QR – #{booking.bookingId}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4 text-lg">
            <p><strong className="text-xl">{memberName}</strong></p>
            <p><strong>Member ID:</strong> {memberId}</p>
            <p><strong>Event:</strong> {eventTitle}</p>
            <p><strong>Tickets:</strong> M:{booking.memberTicketCount} | G:{booking.guestTicketCount} | K:{booking.kidTicketCount}</p>
            <p><strong>Meals:</strong> Veg: {totalVeg} | Non-Veg: {totalNonVeg}</p>
            <p><strong>Amount Paid:</strong> <span className="text-2xl font-bold text-green-600">₹{booking.finalAmount}</span></p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-4 py-1 rounded-full text-white font-bold ${booking.paymentStatus === 'paid' ? 'bg-green-600' : 'bg-orange-600'}`}>
                {booking.paymentStatus.toUpperCase()}
              </span>
            </p>
            <p><strong>UTR:</strong> {utr}</p>
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border-8 border-gray-200">
              <img src={qrUrl} alt="QR Code" className="w-80 h-80" />
              <p className="text-center mt-4 text-gray-600 font-medium">Scan at check-in</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={sendViaWhatsApp}
            disabled={sending}
            className={`bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold flex items-center gap-4 shadow-xl transform hover:scale-105 transition ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {sending ? 'Preparing...' : 'Send via WhatsApp'}
          </button>

          <button
            onClick={downloadQR}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-xl transform hover:scale-105 transition"
          >
            Download QR as PNG
          </button>
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>After clicking "Send via WhatsApp", paste the copied QR image in chat</p>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
