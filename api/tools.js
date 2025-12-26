export default async function handler(req, res) {
    const { url, type } = req.query;
    if (!url) return res.status(400).json({ success: false });

    try {
        if (type === "tiktok") {
            const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
            const j = await r.json();
            return res.status(200).json(j);
        }

        if (type === "yt_thumb") {
            const vId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            if (vId) return res.status(200).json({ success: true, data: { high: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg` } });
        }

        if (type === "insta") {
            // محرك Publer المتقدم لتجاوز حماية انستجرام
            const payload = { url: url };
            const r = await fetch('https://publer.io/api/v1/utilities/direct-video-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const j = await r.json();

            if (j.payload && j.payload.length > 0) {
                // استخراج أول فيديو أو صورة في المنشور
                const media = j.payload[0];
                return res.status(200).json({ 
                    success: true, 
                    data: { 
                        url: media.path, 
                        thumbnail: media.thumbnail || media.path 
                    } 
                });
            }
        }
        
        return res.status(404).json({ success: false, msg: "Not found" });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
