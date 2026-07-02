export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookId, amount } = req.body;
    const ACTIVE_GATEWAY = "upitranzact"; 

    // 🔗 भुगतान सफल होने के बाद का टेलीग्राम रीडायरेक्ट लिंक्स मैप
    const REDIRECT_LINKS_MAP = {
        "VILLAclub_1M": "https://gknews.net/check/pvtc/",
        "VILLAclub_6M": "https://gknews.net/check/pvtc/",
        "VILLAclub_1Y": "https://gknews.net/check/pvtc/",
        "Sweet_Sinner": "https://gknews.net/check/join-premium-sweet-sinner-telegram-channel/",
        "MissaX_Channel": "https://graph.org/MissaX-Channel-08-08",
        "ShopLyfter": "https://gknews.net/check/join-premium-shoplyfter-telegram-channel/",
        "PureTaboo": "https://gknews.net/check/join-premium-puretaboo-telegram-channel/",
        "BrattySis": "https://gknews.net/check/join-premium-brattysis-telegram-channel/",
        "SisSwap": "https://gknews.net/check/join-premium-sisswap-telegram-channel/",
        "Family_Swap": "https://gknews.net/check/join-premium-family-swap-telegram-channel/",
        "Mommys_Boy": "https://gknews.net/check/join-premium-mommys-boy-telegram-channel/",
        "Not_My_Grandpa": "https://gknews.net/check/join-premium-not-my-granda-telegram-channel/"
    };

    const redirectUrl = REDIRECT_LINKS_MAP[bookId] || "https://gknews.net/";

    try {
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }

        if (ACTIVE_GATEWAY === "upitranzact") {
            // =================================================================
            // 🔑 🎯 अपनी असली (या डेमो) ORIGINPAY / UPITRANZACT KEYS यहाँ डालें
            // =================================================================
            const MERCHANT_ID = "bwGiH0"; 
            const PUBLIC_KEY = "utz_live_e5048b33412458da"; 
            const SECRET_KEY = "4d05c32752ea54131a3a8b746f45908b"; 
            // =================================================================

            const orderId = "ORD_" + Date.now();

            // OriginPay के ऑफिशियल सर्वर एंडपॉइंट पर रिक्वेस्ट भेजना
            const apiResponse = await fetch('https://api.upitranzact.com/api/v1/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Public-Key': PUBLIC_KEY,
                    'X-Secret-Key': SECRET_KEY
                },
                body: JSON.stringify({
                    merchant_id: MERCHANT_ID,
                    order_id: orderId,
                    amount: amount.toString(),
                    display_name: "GKnews Store",
                    purpose: `Channel Purchase ${bookId}`,
                    redirect_url: redirectUrl
                })
            });

            // जांचें कि क्या रिस्पॉन्स सही आ रहा है
            if (!apiResponse.ok) {
                const errText = await apiResponse.text();
                return res.status(400).json({ success: false, message: `OriginPay Server Error: ${errText}` });
            }

            const apiData = await apiResponse.json();

            if (apiData && apiData.status === "success") {
                return res.status(200).json({
                    success: true,
                    gateway: "upitranzact",
                    payment_url: apiData.payment_url, // मर्चेंट सुरक्षित पेमेंट स्क्रीन लिंक
                    upi_intent: apiData.upi_intent || null
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: apiData.message || "कीज़ अमान्य हैं या डेमो मोड कॉन्फ़िगर नहीं है।" 
                });
            }
        }

        return res.status(400).json({ success: false, message: "No active gateway set" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "सर्वर कनेक्शन में त्रुटि: " + error.message });
    }
}
