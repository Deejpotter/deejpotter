"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("./ChatInterface"), { ssr: false });

const CncTechnicalAI = () => {
	const [showConversations, setShowConversations] = useState(false);

	return (
		<ChatInterface
			setShowConversations={setShowConversations}
			showConversations={showConversations}
		/>
	);
};

export default CncTechnicalAI;
