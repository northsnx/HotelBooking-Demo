import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, Calendar, Star, Wifi, Coffee, Car, Dumbbell, MessageCircle, X, Send, ChevronLeft, ChevronRight, Check } from 'lucide-react';

// --- Helper Functions ---

// 1. ฟังก์ชันสร้างรหัสบิล (Bill Code Generator)
const generateBillCode = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `BK-${yyyy}${mm}${dd}-${random}`;
};

// 2. ฟังก์ชันคำนวณจำนวนคืน (Nights Calculator)
const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1; // Default 1 night
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays > 0 ? diffDays : 1;
};

// --- Data & Constants ---

const roomsData = [
  {
    id: 1,
    name: "ห้องเดี่ยว (Single Room)",
    price: 5000,
    deposit: 0,
    max_adults: 2,
    max_children: 1,
    description: "ห้องเดี่ยวสำหรับพักผ่อนอย่างเป็นส่วนตัว เหมาะสำหรับผู้เข้าพัก 1-2 คน",
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"]
  },
  {
    id: 2,
    name: "ห้องคู่ (Double Room)",
    price: 8000,
    deposit: 2500,
    max_adults: 4,
    max_children: 2,
    description: "ห้องคู่รองรับได้สูงสุด 5 คน เหมาะสำหรับกลุ่มเพื่อนหรือครอบครัว ขนาดกว้างและสะดวกสบาย",
    amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "Smart TV"],
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"]
  },
  {
    id: 3,
    name: "ห้องสวีท (Suite)",
    price: 12000,
    deposit: 4000,
    max_adults: 6,
    max_children: 2,
    description: "ห้องสวีทสุดหรู รองรับคนได้มากถึง 8 คน พร้อมพื้นที่กว้างขวางและสิ่งอำนวยความสะดวกครบครัน",
    amenities: ["Free WiFi", "Air Conditioning", "Living Room", "2 Bathrooms", "Smart TV"],
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"]
  }
];

const hotelInfo = {
  policies: {
    checkIn: "14:00 น.",
    checkOut: "12:00 น.",
    breakfast: "รวมอาหารเช้าฟรีสำหรับทุกห้อง",
    parking: "มีที่จอดรถฟรี",
    cancellation: "ยกเลิกฟรี 48 ชั่วโมงก่อนเช็คอิน",
    wifi: "ฟรี WiFi ความเร็วสูงทั่วบริเวณ"
  },
  facilities: ["ฟิตเนส", "สระว่ายน้ำ", "ห้องอาหาร", "บาร์", "สปา"],
  location: "ใจกลางเมือง ใกล้แหล่งท่องเที่ยวสำคัญ"
};

// --- Components ---

const Chatbot = ({ isOpen, onClose, searchParams, currentRoom }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "สวัสดีครับ! ผมเป็นผู้ช่วยส่วนตัวของคุณ มีอะไรให้ผมช่วยไหมครับ? (เช่น สอบถามราคา, เวลาเช็คอิน, หรือพิมพ์ 'ยืนยัน' เพื่อจองห้องที่ดูอยู่)" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Logic การจองและสร้างบิล (ตาม Snippet ของคุณ)
  const handleBookingProcess = () => {
    if (!currentRoom) {
      return "กรุณาเลือกห้องพักที่ต้องการก่อนทำการยืนยันการจองครับ";
    }

    const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);
    const roomRate = currentRoom.price;
    const deposit = currentRoom.deposit || 0;
    const taxes = roomRate * nights * 0.07; // สมมติภาษี 7%
    const subtotal = roomRate * nights;
    const total = subtotal + taxes;
    const totalGuests = searchParams.adults + searchParams.children;
    const billCode = generateBillCode();

    const summary = [];
    summary.push(`📌 **สรุปรายการการจอง**`);
    summary.push(`ห้อง: ${currentRoom.name}`);
    summary.push(`วันที่: ${searchParams.checkIn || 'ไม่ระบุ'} ถึง ${searchParams.checkOut || 'ไม่ระบุ'}`);
    summary.push(`จำนวนผู้เข้าพัก: ผู้ใหญ่ ${searchParams.adults} คน, เด็ก ${searchParams.children} คน (รวม ${totalGuests} คน)`);
    summary.push(`จำนวนคืนที่พัก: ${nights} คืน`);
    summary.push(`ราคาต่อคืน: ${roomRate.toLocaleString()} บาท`);
    summary.push(`ราคารวมห้องพัก: ${subtotal.toLocaleString()} บาท`);
    
    if (deposit > 0) summary.push(`ค่ามัดจำ: ${deposit.toLocaleString()} บาท`);
    summary.push(`ภาษี (7%): ${taxes.toLocaleString()} บาท`);
    summary.push(`------------------------------`);
    summary.push(`💰 **รวมทั้งสิ้นที่ต้องชำระ: ${(total + deposit).toLocaleString()} บาท**`);
    summary.push(`🧾 รหัสบิล: ${billCode}`);
    summary.push(`\nกรุณานำรหัสบิลไปชำระที่เคาน์เตอร์ภายในเวลาที่กำหนด เจ้าหน้าที่จะออกใบเสร็จให้หลังชำระเรียบร้อยครับ 😊`);

    return summary.join('\n');
  };

  const getBotResponse = (userInput) => {
    const text = userInput.toLowerCase();

    // 1. Logic การยืนยัน/จอง/สรุป (Bill Generation)
    if (text.includes('ยืนยัน') || text.includes('จอง') || text.includes('สรุป') || text.includes('book')) {
      return handleBookingProcess();
    }

    // 2. Check-in/out
    if (text.includes('เช็คอิน') || text.includes('check in')) return `เวลาเช็คอินเริ่ม ${hotelInfo.policies.checkIn} หากต้องการเช็คอินก่อน กรุณาแจ้งล่วงหน้าครับ`;
    if (text.includes('เช็คเอาท์') || text.includes('check out')) return `เวลาเช็คเอาท์คือ ${hotelInfo.policies.checkOut} หากต้องการขยายเวลาโปรดติดต่อเจ้าหน้าที่ครับ`;

    // 3. Breakfast/Food
    if (text.includes('อาหารเช้า') || text.includes('กิน') || text.includes('breakfast')) return hotelInfo.policies.breakfast;

    // 4. Facilities
    if (text.includes('มีอะไรบ้าง') || text.includes('สระว่ายน้ำ') || text.includes('ฟิตเนส')) {
      return `สิ่งอำนวยความสะดวกของเรามี: ${hotelInfo.facilities.join(', ')} ครับ`;
    }

    // 5. Default
    return "ผมยังไม่เข้าใจคำสั่งนั้นครับ ลองพิมพ์ 'ยืนยัน' เพื่อจองห้องที่เลือก หรือถามเกี่ยวกับเวลาเช็คอิน/สิ่งอำนวยความสะดวกได้ครับ";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      // ตรวจสอบว่าเป็นข้อความหลายบรรทัดหรือไม่ (สำหรับบิล)
      const responseText = getBotResponse(input);
      const botResponse = { type: 'bot', text: responseText };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
    
    setInput('');
  };

  // Trigger from "Book Now" button (Optional: could use useEffect to watch props)
  useEffect(() => {
      if (isOpen && messages.length === 1 && currentRoom) {
          // ถ้าเปิด Chatbot มาตอนดูห้องอยู่ ให้แนะนำการจอง
           setMessages(prev => [...prev, { type: 'bot', text: `คุณกำลังดูห้อง "${currentRoom.name}" สนใจพิมพ์ "ยืนยัน" เพื่อรับใบเสนอราคาไหมครับ?` }]);
      }
  }, [isOpen, currentRoom]);


  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 font-sans">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2"><MessageCircle size={18}/> Hotel Assistant</h3>
        <button onClick={onClose} className="hover:bg-blue-700 rounded p-1">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-line shadow-sm ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ room, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl group"
  >
    <div className="relative overflow-hidden">
        <img src={room.images[0]} alt={room.name} className="w-full h-48 object-cover transition duration-500 group-hover:scale-110" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{room.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
        <Users size={16} />
        <span>ผู้ใหญ่ {room.max_adults}, เด็ก {room.max_children}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">฿{room.price.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">/คืน</span>
        </div>
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white transition">
          ดูรายละเอียด
        </button>
      </div>
    </div>
  </div>
);

// Room Detail Page Component
const RoomDetail = ({ room, onBack, onBookNow }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ChevronLeft size={20} />
          ย้อนกลับไปหน้าค้นหา
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative h-96 lg:h-full">
            <img 
              src={room.images[currentImageIdx]} 
              alt={room.name} 
              className="w-full h-full object-cover"
            />
            {/* Gallery Controls omitted for brevity but logic exists in original */}
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
                <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">฿{room.price.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm">ต่อคืน</div>
                </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-6">
                    <span className="flex items-center gap-1"><Users size={16}/> สูงสุด {room.max_adults + room.max_children} คน</span>
                    {room.deposit > 0 && <span className="flex items-center gap-1 text-orange-600">มัดจำ ฿{room.deposit.toLocaleString()}</span>}
                </div>

                <div className="border-t border-b py-6 mb-6">
                <h2 className="text-lg font-semibold mb-3">รายละเอียด</h2>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
                </div>

                <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">สิ่งอำนวยความสะดวก</h2>
                <div className="grid grid-cols-2 gap-3">
                    {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                        <Check size={18} className="text-green-500" />
                        <span>{amenity}</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            <button 
                onClick={onBookNow}
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 flex justify-center items-center gap-2"
            >
                <MessageCircle size={24} />
                จองเลย (ผ่านแชท)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function HotelBookingApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0
  });
  const [filteredRooms, setFilteredRooms] = useState(roomsData);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Search Logic
  const handleSearch = () => {
    // Simple filter logic
    const results = roomsData.filter(room => {
        const totalGuests = searchParams.adults + searchParams.children;
        const roomCapacity = room.max_adults + room.max_children;
        return roomCapacity >= totalGuests;
    });
    setFilteredRooms(results);
  };

  const handleBookNowClick = () => {
      setChatbotOpen(true);
      // Chatbot will handle the "Confirm" prompt via useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {currentPage === 'detail' && selectedRoom ? (
        <RoomDetail 
            room={selectedRoom} 
            onBack={() => {
                setCurrentPage('home'); 
                setSelectedRoom(null);
            }} 
            onBookNow={handleBookNowClick}
        />
      ) : (
        <>
            {/* Hero & Search Section */}
            <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white pb-24">
                <div className="container mx-auto px-4 pt-16 pb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">โรงแรมเที่ยวไทย ไปไหน ไปกับใคร</h1>
                    <p className="text-lg md:text-xl opacity-90 mb-8">จองที่พักง่ายๆ พร้อมผู้ช่วยส่วนตัว 24 ชม.</p>
                </div>

                {/* Search Box */}
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto text-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">เช็คอิน</label>
                                <input type="date" className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    value={searchParams.checkIn} onChange={e => setSearchParams({...searchParams, checkIn: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">เช็คเอาท์</label>
                                <input type="date" className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    value={searchParams.checkOut} onChange={e => setSearchParams({...searchParams, checkOut: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">ผู้ใหญ่</label>
                                <input type="number" min="1" className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    value={searchParams.adults} onChange={e => setSearchParams({...searchParams, adults: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">เด็ก</label>
                                <input type="number" min="0" className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    value={searchParams.children} onChange={e => setSearchParams({...searchParams, children: parseInt(e.target.value)})} />
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2">
                            <Search size={20} /> ค้นหาห้องพัก
                        </button>
                    </div>
                </div>
            </div>

            {/* Room List */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">ห้องพักที่ว่าง</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRooms.map(room => (
                        <RoomCard 
                            key={room.id} 
                            room={room} 
                            onClick={() => {
                                setSelectedRoom(room);
                                setCurrentPage('detail');
                            }} 
                        />
                    ))}
                </div>
            </div>
        </>
      )}

      {/* Chatbot Button & Component */}
      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-40 animate-bounce-slow"
      >
        <MessageCircle size={28} />
      </button>

      {/* ส่ง Props ที่จำเป็นเข้าไปใน Chatbot เพื่อให้คำนวณบิลได้ */}
      <Chatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)} 
        searchParams={searchParams}
        currentRoom={selectedRoom}
      />
    </div>
  );
}