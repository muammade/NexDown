let mode = 'tiktok'; // الأداة الافتراضية عند فتح الموقع

        // وظيفة التبديل بين الأدوات وتغيير شكل البطاقات
        function setTool(t, el) {
            mode = t;
            // إزالة الحالة النشطة من جميع البطاقات وإضافتها للمختارة
            document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            
            // تنبيه بسيط للأداة التي لم تكتمل بعد
            if(t === 'bg_rem') alert('هذه الميزة ستتوفر في التحديث القادم!');
            
            // إخفاء منطقة النتائج عند التبديل لبدء عملية جديدة
            document.getElementById('displayArea').style.display = 'none';
        }

        // عند الضغط على زر "بدء السحر"
        document.getElementById('goBtn').onclick = async () => {
            const val = document.getElementById('urlInput').value.trim();
            if(!val) return alert('الرجاء إدخال رابط');
            
            const btn = document.getElementById('goBtn');
            btn.innerText = '... جاري التنفيذ';
            btn.disabled = true;
            
            try {
                // نرسل الطلب إلى المسار الجديد api/tools
                const r = await fetch(`/api/tools?url=${encodeURIComponent(val)}&type=${mode}`);
                const j = await r.json();

                if(j.code === 0 || j.success) {
                    const d = j.data;
                    // عرض النتيجة حسب نوع الأداة (تيك توك أو يوتيوب)
                    document.getElementById('resImg').src = mode === 'tiktok' ? d.cover : d.high;
                    document.getElementById('dlLink').href = mode === 'tiktok' ? (d.hdplay || d.play) : d.high;
                    document.getElementById('displayArea').style.display = 'block';
                    
                    // تحريك الصفحة للأسفل لرؤية النتيجة
                    document.getElementById('displayArea').scrollIntoView({ behavior: 'smooth' });
                } else { 
                    alert('عذراً، لم نتمكن من جلب البيانات. تأكد من الرابط.'); 
                }
            } catch(e) { 
                alert('فشل الاتصال بالسيرفر!'); 
            } finally {
                btn.innerText = 'بدء السحر';
                btn.disabled = false;
            }
        }