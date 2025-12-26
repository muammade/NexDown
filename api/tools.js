let mode = 'tiktok';

        function setTool(t, el) {
            mode = t;
            document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('displayArea').style.display = 'none';
        }

        document.getElementById('goBtn').onclick = async () => {
            const val = document.getElementById('urlInput').value.trim();
            if(!val) return alert('الرجاء إدخال الرابط');
            
            const btn = document.getElementById('goBtn');
            btn.innerText = 'جاري المعالجة...';
            
            try {
                // نستخدم مسار api/tools الذي أنشأناه
                const response = await fetch(`/api/tools?url=${encodeURIComponent(val)}&type=${mode}`);
                
                if (!response.ok) throw new Error('السيرفر لا يستجيب');
                
                const j = await response.json();

                if (mode === 'tiktok' && j.code === 0) {
                    document.getElementById('resImg').src = j.data.cover;
                    document.getElementById('dlLink').href = j.data.hdplay || j.data.play;
                    document.getElementById('displayArea').style.display = 'block';
                } 
                else if (mode === 'yt_thumb' && j.success) {
                    document.getElementById('resImg').src = j.data.high;
                    document.getElementById('dlLink').href = j.data.high;
                    document.getElementById('displayArea').style.display = 'block';
                } 
                else {
                    alert('هذا الرابط لا يحتوي على بيانات عامة أو غير مدعوم');
                }
            } catch (e) {
                console.error(e);
                alert('حدث خطأ في الاتصال: تأكد من رفع ملف api/tools.js بشكل صحيح');
            } finally {
                btn.innerText = 'بدء السحر';
            }
        }
