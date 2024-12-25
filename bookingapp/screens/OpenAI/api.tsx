import OpenAI from "openai";

// Tạo cấu hình cho OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Hàm để gọi API và nhận phản hồi từ GPT-4
export const getGPT4Response = async (query: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là một chatbot hỗ trợ người dùng." },
        { role: "user", content: query },
      ],
    });

    return response.choices[0].message.content; // Trả về nội dung trả lời
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    return "Đã xảy ra lỗi khi xử lý yêu cầu.";
  }
};