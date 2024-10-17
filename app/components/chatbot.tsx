import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Typing the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI("AIzaSyDUOzLLpimRWyNu-03VC8hNaUdAUSPTIN0");

// Define the message type
interface Message {
  text: string;
  type: 'user' | 'bot';
}

const generateResponse = async (prompt: string): Promise<string | undefined> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 80, temperature: 0.9 },
    systemInstruction: {
      text: `
       You are a friendly and empathic AI assistant, here to answer questions concisely. 
       Your name is SupremoBot and you represent the company Supremo, based in France.
         The company SUPREME (SUPREME) was created on August 14, 2006, making it 18 years old. 
        Its legal form is a limited liability company. It specializes in the retail shoe business. 
        In 2022, it was categorized as a Small or Medium Enterprise (SME) with 1 or 2 employees.

        The company’s headquarters are located at 11 Rue de la République, 97100 Basse-Terre. 
        Supremo International Co., Ltd has been active in France since November 1, 2021. 
        It is also a limited liability company (SARL) registered at the same address, with the NAF/APE code 47.72A.
        
        You can contact Supremo by email at adv@superiamo.fr for any inquiries.
      `,
    },
  });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    return undefined;
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input) return;

    const userMessage: Message = { text: input, type: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    const prompt = input;

    try {
      const result = await generateResponse(prompt);
      if (result) {
        const botMessage: Message = { text: result, type: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const errorMessage: Message = { text: "I'm sorry, but I couldn't generate a response at the moment.", type: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <button onClick={toggleChat} className="fixed bottom-8 right-16 lg:right-16 bg-white text-white rounded-full p-3 shadow-xl transition">
        <img width="48" height="48" src="/images/chatbotrose.png" alt="message-bot" />
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-16 lg:right-16 border border-pink-500 bg-white rounded-lg shadow-lg w-[300px] lg:w-[600px]">
          <div className="flex justify-between items-center bg-white text-white p-2 rounded-t-lg">
            <h2 className="font-bold text-pink-500">SupremoBot</h2>
            <button onClick={toggleChat} className="text-pink-500">X</button>
          </div>
          <div className="p-2 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`my-1 ${msg.type === 'user' ? 'text-right text-white' : 'text-left'}`}>
                <span className={`inline-block px-2 py-1 sm:max-w-sm max-w-md rounded-lg text-black ${msg.type === 'user' ? 'bg-pink-500 text-white' : 'bg-white text-black'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex p-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border border-pink-500 rounded-lg p-2 text-black hover:border-black"
            />
            <button onClick={handleSend} className="ml-2 bg-pink-500 text-black rounded-lg px-4 py-2 hover:bg-pink-500 transition">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
