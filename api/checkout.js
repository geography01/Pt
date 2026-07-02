export default async function handler(req, res) {
    // सिर्फ POST रिक्वेस्ट को अनुमति दें
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookId, amount } = req.body;

    // =================================================================
    // ⚙️ एडमिन कंट्रोलर (ADMIN GATEWAY CONTROLLER)
    // =================================================================
    // अब UPITranzact को मैन्युअल चलाने के लिए इसे "upitranzact" पर सेट करें
    const ACTIVE_GATEWAY = "upitranzact"; 
    // =================================================================

    try {
        // 🟢 रूट 1: Razorpay
        if (ACTIVE_GATEWAY === "razorpay") {
            return res.status(200).json({
                success: true,
                gateway: "razorpay",
                key: "rzp_test_YOUR_RAZORPAY_KEY", 
                orderId: "ord_" + Math.random().toString(36).substring(2, 10),
                amount: amount * 100 
            });
        } 
        
        // 🟢 रूट 2: JioPay
        else if (ACTIVE_GATEWAY === "jiopay") {
            return res.status(200).json({
                success: true,
                gateway: "jiopay",
                mid: "YOUR_JIO_MERCHANT_ID", 
                amount: amount
            });
        }
        
        // 🟢 रूट 3: UPITranzact (🎯 लाइव API क्रेडेंशियल्स बॉक्स)
        else if (ACTIVE_GATEWAY === "upitranzact") {
            return res.status(200).json({
                success: true,
                gateway: "upitranzact",
                amount: amount,
                
                // 🛑 अपनी असली डिटेल्स नीचे कूट्स "" के अंदर पेस्ट करें:
                merchantId: "यहाँ अपनी UPITranzact मर्चेंट आईडी डालें",
                publicKey: "UPIT_PUB_xxxxxx (यहाँ अपनी पब्लिक की डालें)",
                secretKey: "UPIT_SEC_xxxxxx (यहाँ अपनी सीक्रेट की डालें)",
                
                // आपके पुराने पैरामीटर्स (बैकअप के लिए)
                vpa: "rahul880250@ybl", 
                merchantName: "GKnews Store",
                orderId: "TXN_" + Math.random().toString(36).substring(2, 10).toUpperCase()
            });
        }
        
        else {
            return res.status(400).json({ success: false, message: "No active gateway set" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
