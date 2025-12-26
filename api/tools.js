export default async function handler(req, res) {
    const { url, type } = req.query;
    if (!url) return res.status(400).json({ error: "No URL" });

    try {
        if (type === "tiktok") {
            const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
            const j = await r.json();
            return res.status(200).json(j);
        }

        if (type === "yt_thumb" || type === "yt_info") {
            const vId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            if (!vId) return res.status(400).json({ error: "Invalid YouTube URL" });

            if (type === "yt_thumb") {
                return res.status(200).json({ success: true, data: { high: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg` } });
            }

            const infoRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${vId}`);
            const infoData = await infoRes.json();
            return res.status(200).json({ 
                success: true, 
                data: { 
                    title: infoData.title, 
                    high: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg` 
                } 
            });
        }
    } catch (e) {
        return res.status(500).json({ error: "Server Error" });
    }
}
