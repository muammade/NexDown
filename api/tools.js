export default async function handler(req, res) {
    // تحديد الرؤوس للسماح بالطلبات (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url, type } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: "URL missing" });
    }

    try {
        if (type === "yt_thumb") {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(regex);
            const videoId = match ? match[1] : null;

            if (videoId) {
                return res.status(200).json({
                    success: true,
                    data: { high: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }
                });
            }
            return res.status(400).json({ success: false, error: "Invalid YouTube URL" });
        }

        if (type === "tiktok") {
            // استخدام fetch المدمج في Vercel (Node.js 18+)
            const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
            const result = await response.json();
            return res.status(200).json(result);
        }

        return res.status(400).json({ success: false, error: "Unsupported type" });

    } catch (error) {
        // في حال حدوث أي خطأ، نرسل رسالة واضحة بدلاً من انهيار السيرفر
        return res.status(500).json({ success: false, error: error.message });
    }
}
