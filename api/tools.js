let mode = 'tiktok';

function setTool(t, el) {
    mode = t;
    document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('displayArea').style.display = 'none';
    
    // إظهار input الرابط أو زر رفع الملف حسب الأداة
    if(t === 'bg_rem') {
        document.getElementById('urlInput').style.display = 'none';
        document.getElementById('fileInput').style.display = 'block';
    } else {
        document.getElementById('urlInput').style.display = 'block';
        document.getElementById('fileInput').style.display = 'none';
    }
}

document.getElementById('goBtn').onclick = async () => {
    const btn = document.getElementById('goBtn');
    
    // --- الأداة الثالثة: مسح الخلفية ---
    if(mode === 'bg_rem') {
        const fileInput = document.getElementById('fileInput');
        if(!fileInput.files[0]) return alert('الرجاء اختيار صورة أولاً');
        
        btn.innerText = 'جاري مسح الخلفية (انتظر لحظة)...';
        btn.disabled = true;
        
        try {
            const imageSource = fileInput.files[0];
            const blob = await imglyRemoveBackground(imageSource);
            const url = URL.createObjectURL(blob);
            
            document.getElementById('resImg').src = url;
            document.getElementById('dlLink').href = url;
            document.getElementById('dlLink').download = "NexDown_NoBG.png";
            document.getElementById('displayArea').style.display = 'block';
        } catch (e) {
            alert('خطأ في معالجة الصورة');
        } finally {
            btn.innerText = 'بدء السحر';
            btn.disabled = false;
        }
        return; // إنهاء الوظيفة هنا للأداة الثالثة
    }

    // --- الأدوات القديمة (تيك توك ويوتيوب) ---
    const val = document.getElementById('urlInput').value.trim();
    if(!val) return alert('أدخل الرابط');
    btn.innerText = 'جاري المعالجة...';
    
    try {
        const response = await fetch(`/api/tools?url=${encodeURIComponent(val)}&type=${mode}`);
        const j = await response.json();

        if ((mode === 'tiktok' && j.code === 0) || (mode === 'yt_thumb' && j.success)) {
            const d = j.data;
            document.getElementById('resImg').src = mode === 'tiktok' ? d.cover : d.high;
            document.getElementById('dlLink').href = mode === 'tiktok' ? (d.hdplay || d.play) : d.high;
            document.getElementById('displayArea').style.display = 'block';
        } else {
            alert('الرابط غير صحيح');
        }
    } catch (e) {
        alert('فشل الاتصال');
    } finally {
        btn.innerText = 'بدء السحر';
    }
}
