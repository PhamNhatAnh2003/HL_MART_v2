import React, { useEffect } from "react";

const ChatBox = () => {
    useEffect(() => {
        // Kiểm tra nếu script đã được thêm vào body rồi
        if (
            !document.querySelector(
                "script[src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1']"
            )
        ) {
            const script = document.createElement("script");
            script.src =
                "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <df-messenger
            intent="WELCOME"
            chat-title="HLMartSupport"
            agent-id="5d19fa8d-30d4-4a93-943d-8ff5c4fe2eda"
            language-code="en"
        ></df-messenger>
    );
};

export default ChatBox;
