export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookId, amount } = req.body;

    // =================================================================
    // ⚙️ एडमिन कंट्रोलर (ADMIN GATEWAY CONTROLLER)
    // =================================================================
    const ACTIVE_GATEWAY = "jiopay"; 
    // =================================================================

    // =================================================================
    // 🔗 मैन्युअल रीडायरेक्ट लिंक्स (भविष्य में यहाँ लिंक बदलें)
    // =================================================================
    const REDIRECT_LINKS_MAP = {
        "VILLAclub_1M": "https://gknews.net/check/pvtc/", // 1 मंथ विलाक्लब का लिंक
        "VILLAclub_6M": "https://gknews.net/check/pvtc/", // 6 मंथ विलाक्लब का लिंक
        "VILLAclub_1Y": "https://gknews.net/check/pvtc/", // 1 ईयर विलाक्लब का लिंक
        
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

    // डिफ़ॉल्ट लिंक यदि ऊपर कोई बुकआईडी मैच न हो
    const defaultRedirectUrl = "https://gknews.net/";
    const redirectUrl = REDIRECT_LINKS_MAP[bookId] || defaultRedirectUrl;
    // =================================================================

    try {
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }

        // 🟢 रूट 1: Razorpay
        if (ACTIVE_GATEWAY === "razorpay") {
            return res.status(200).json({
                success: true,
                gateway: "razorpay",
                key: "rzp_test_YOUR_RAZORPAY_KEY",
                orderId: "ord_" + Math.random().toString(36).substring(2, 10),
                amount: amount * 100,
                redirectUrl: redirectUrl // फ्रंटएंड को लिंक भेजा जा रहा है
            });
        } 
        
        // 🟢 रूट 2: JioPay
        else if (ACTIVE_GATEWAY === "jiopay") {
            return res.status(200).json({
                success: true,
                gateway: "jiopay",
                mid: "YOUR_JIO_MERCHANT_ID",
                amount: amount,
                redirectUrl: redirectUrl // फ्रंटएंड को लिंक भेजा जा रहा है
            });
        }
        
        // 🟢 रूट 3: UPITranzact
        else if (ACTIVE_GATEWAY === "upitranzact") {
            return res.status(200).json({
                success: true,
                gateway: "upitranzact",
                vpa: "raywiwy250@ybl", 
                merchantName: "GKnews Store",
                amount: amount,
                redirectUrl: redirectUrl // फ्रंटएंड को लिंक भेजा जा रहा है
            });
        }
        
        else {
            return res.status(400).json({ success: false, message: "No active gateway set" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
