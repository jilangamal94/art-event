const eventDate = new Date(2026, 11, 10,16,0,0).getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    // لو تاريخ المعرض جه أو عدى
    if (timeLeft < 0) {
        document.getElementById("countdown").innerHTML = "<h4>لقد انطلق المعرض الآن!</h4>";
        return;
    }

    // حساب الأيام، الساعات، الدقائق، والثواني
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown(); 
// استدعاء عناصر الفورم من الـ HTML
const bookingForm = document.getElementById('bookingForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const ticketTypeSelect = document.getElementById('ticketType');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

const successMessage = document.getElementById('successMessage');
const welcomeText = document.getElementById('welcomeText');

bookingForm.addEventListener('submit', function(e) {
    // منع إعادة تحميل الصفحة
    e.preventDefault();

    // تصفية رسائل الخطأ القديمة
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';

    let isValid = true;

    // جلب القيم وقص المسافات الزائدة
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const ticketType = ticketTypeSelect.value;

    // التحقق من الاسم
    if (fullName === '') {
        nameError.textContent = 'من فضلك أدخل الاسم بالكامل';
        isValid = false;
    }

    // التحقق من البريد الإلكتروني
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'من فضلك أدخل البريد الإلكتروني';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = 'البريد الإلكتروني غير صحيح';
        isValid = false;
    }

    // التحقق من رقم الهاتف
    const phonePattern = /^01[0-9]{9}$/;
    if (phone === '') {
        phoneError.textContent = 'من فضلك أدخل رقم الهاتف';
        isValid = false;
    } else if (!phonePattern.test(phone)) {
        phoneError.textContent = 'رقم الهاتف غير صحيح (يجب أن يكون 11 رقماً ويبدأ بـ 01)';
        isValid = false;
    }

    // لو كل البيانات سليمة
    if (isValid) {
        const bookingData = {
            fullName: fullName,
            email: email,
            phone: phone,
            ticketType: ticketType,
            bookingDate: new Date().toISOString()
        };

        // حفظ البيانات في Local Storage (لضمان الاحتفاظ بها محلياً أيضاً)
        let bookings = JSON.parse(localStorage.getItem('exhibitionBookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('exhibitionBookings', JSON.stringify(bookings));

        // تخصيص رسالة الترحيب
        const ticketTypeText = ticketType === 'vip' ? 'دعوة كبار الزوار (VIP)' : 'زائر للمعرض';
        welcomeText.textContent = `أهلاً بك يا ${fullName}! تم تسجيل حجزك بنجاح (${ticketTypeText}). جاري تحويلك لتأكيد الحجز عبر الواتساب...`;

        // إظهار صندوق النجاح
        successMessage.classList.remove('hidden');
        bookingForm.reset();

        // تجهيز بيانات الواتساب
        const ownerWhatsAppNumber = '201000000000'; //  هذا الرقم رقم صاحب المعرض الحقيقي
        
        const messageText = `مرحباً، أريد تأكيد حجزي في المعرض:\n- الاسم: ${fullName}\n- البريد: ${email}\n- الهاتف: ${phone}\n- نوع الحضور: ${ticketTypeText}`;
        
        // ترميز النص ليناسب رابط الـ URL
        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodedMessage}`;

        // فتح رابط الواتساب تلقائياً بعد ثانية ونصف ليقرأ المستخدم رسالة النجاح أولاً
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);
    }
});