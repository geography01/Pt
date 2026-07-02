export default async function handler(req, res) {
    // सिर्फ POST रिक्वेस्ट को अनुमति दें
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookId, amount } = req.body;

    // ⚙️ एडमिन कंट्रोलर: टेस्ट करने के लिए इसे "upitranzact" पर ही रखें
    const ACTIVE_GATEWAY = "upitranzact"; 

    // 🔗 भुगतान सफल होने के बाद का मैन्युअल रीडायरेक्ट लिंक्स मैप
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
            // 🔑 🎯 अपनी असली ORIGINPAY / UPITRANZACT LIVE KEYS यहाँ डालें
            // =================================================================
            const MERCHANT_ID = "bwGiH0"; 
            const PUBLIC_KEY = "utz_test_7ebce39ff223f06e"; 
            const SECRET_KEY = "48d793de1d34f2beb66a3c0eabc82bfb"; 
            // =================================================================

            const orderId = "ORD_" + Date.now() + Math.random().toString(36).substring(2, 5).toUpperCase();

            // OriginPay API के नियमों के अनुसार मर्चेंट सर्वर पर रिक्वेस्ट भेजना
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

            const apiData = await apiResponse.json();

            // यदि OriginPay सर्ver सफलतापूर्वक पेमेंट लिंक या UPI Intent जनरेट कर देता है
            if (apiData && apiData.status === "success") {
                return res.status(200).json({
                    success: true,
                    gateway: "upitranzact",
                    payment_url: apiData.payment_url, // OriginPay द्वारा दिया गया पेमेंट पेज या QR लिंक
                    upi_intent: apiData.upi_intent || null, // मोबाइल के लिए डायरेक्ट ऐप्स ट्रिगर लिंक
                    redirectUrl: redirectUrl
                });
            } else {
                // यदि कीज़ गलत हैं या कोई अन्य तकनीकी समस्या है
                return res.status(400).json({ 
                    success: false, 
                    message: apiData.message || "OriginPay API Error" 
                });
            }
        }

        return res.status(400).json({ success: false, message: "Gateway not supported in this test mode" });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
