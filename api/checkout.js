// डायनेमिक अलर्ट बॉक्स को दिखाने और बंद करने का फ़ंक्शन
function showCustomAlert(icon, textHi, textEn) {
    document.getElementById('alertIcon').innerText = icon;
    document.getElementById('alertTextHi').innerText = textHi;
    document.getElementById('alertTextEn').innerText = textEn;
    document.getElementById('customAlertOverlay').classList.add('active');
}

function closeCustomAlert() {
    document.getElementById('customAlertOverlay').classList.remove('active');
}

// ⚙️ मैन्युअल गेटवे और लिंक कंट्रोलर (बिना बैकएंड एपीआई के सीधा कंट्रोल)
async function purchaseBook(bookId, price) {
    
    // =================================================================
    // 🎛️ यहाँ सेट करें कौन सा गेटवे चालू करना है: "jiopay" या "upitranzact" या "razorpay"
    // =================================================================
    const MANUAL_ACTIVE_GATEWAY = "razorpay"; 
    // =================================================================

    // 🔗 हर पोस्ट/प्लान का मैन्युअल रीडायरेक्ट लिंक
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

    const manualRedirectUrl = REDIRECT_LINKS_MAP[bookId] || "https://gknews.net/";

    try {
        // 🟢 रूट 1: यदि मैन्युअल सेटिंग्स में JioPay चालू है
        if (MANUAL_ACTIVE_GATEWAY === "jiopay") {
            showCustomAlert("💳", "JioPay One सुरक्षित पेमेंट स्क्रीन पर रीडायरेक्ट किया जा रहा है...", "Redirecting to secure JioPay One checkout screen...");
            
            // पेमेंट स्क्रीन का अहसास देने के लिए 4 सेकंड का टाइमर, फिर सीधा टेलीग्राम लिंक पर रीडायरेक्ट
            setTimeout(() => {
                handlePaymentSuccess(manualRedirectUrl);
            }, 4000);
        } 
        
        // 🟢 रूट 2: यदि मैन्युअल सेटिंग्स में UPITranzact चालू है (डायरेक्ट UPI Apps ट्रिगर)
        else if (MANUAL_ACTIVE_GATEWAY === "upitranzact") {
            const myUpiId = "rahul880250@ybl"; // आपकी UPI ID
            const myMerchantName = "GKnews Store"; // आपका मर्चेंट नाम
            
            // मोबाइल यूजर्स के लिए सीधा UPI Apps (PhonePe, Paytm, GooglePay) खोलने का लिंक
            const upiUrl = `upi://pay?pa=${myUpiId}&pn=${encodeURIComponent(myMerchantName)}&am=${price}&cu=INR&tn=Channel_Purchase_${bookId}`;
            window.location.href = upiUrl;
            
            // पेमेंट ऐप खुलने के 5 सेकंड बाद सक्सेस अलर्ट और टेलीग्राम रीडायरेक्शन
            setTimeout(() => {
                handlePaymentSuccess(manualRedirectUrl);
            }, 5000); 
        }

        // 🟢 रूट 3: यदि मैन्युअल सेटिंग्स में Razorpay चालू है
        else if (MANUAL_ACTIVE_GATEWAY === "razorpay") {
            var options = {
                "key": "rzp_test_YOUR_RAZORPAY_KEY", // यहाँ अपनी असली रेजरपे की डालें
                "amount": price * 100, // रुपयों को पैसों में बदलने के लिए
                "currency": "INR",
                "name": "GKnews",
                "description": "Purchase Access to " + bookId,
                "handler": function (res) {
                    handlePaymentSuccess(manualRedirectUrl);
                },
                "theme": { "color": "#1c3e94" }
            };
            var rzp = new Razorpay(options);
            rzp.open();
        }

    } catch (err) {
        console.error("Payment Error:", err);
        showCustomAlert("⚠️", "प्रक्रिया शुरू करने में समस्या आई।", "Error processing your request.");
    }
}

function handlePaymentSuccess(redirectUrl) {
    showCustomAlert("🎉", "भुगतान सफल रहा! आपको अब प्रीमियम चैनल लिंक पर रीडायरेक्ट किया जा रहा है।", "Payment successful! Redirecting you to the premium channel link now.");
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 3000);
}
