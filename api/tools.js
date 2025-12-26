export default async function handler(req, res) {
    const { url, type } = req.query;
    if (!url) return res.status(400).json({ success: false });

    try {
        // --- محرك تيك توك ---
        if (type === "tiktok") {
            const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
            const j = await r.json();
            return res.status(200).json(j);
        }

        // --- محرك انستجرام (تحديث) ---
        if (type === "insta") {
            // استخدام محرك snapinsta البديل عبر API سريع
            const r = await fetch(`https://api.snapany.com/api/v1/ig/download?url=${encodeURIComponent(url)}`);
            const j = await r.json();
            
            if (j.data && j.data.media && j.data.media.length > 0) {
                return res.status(200).json({ 
                    success: true, 
                    data: { 
                        url: j.data.media[0].url, 
                        thumbnail: j.data.media[0].thumbnail || j.data.media[0].url 
                    } 
                });
            }
            // محرك احتياطي في حال فشل الأول
            const fallback = await fetch(`https://api.vkrdown.com/instavideo/?url=${encodeURIComponent(url)}`);
            const fj = await fallback.json();
            if(fj.data) return res.status(200).json({ success: true, data: { url: fj.data[0].url, thumbnail: fj.data[0].thumbnail } });
        }

        // --- محرك يوتيوب ---
        if (type === "yt_thumb") {
            const vId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            if (vId) return res.status(200).json({ success: true, data: { high: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg` } });
        }
        
        return res.status(404).json({ success: false });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
