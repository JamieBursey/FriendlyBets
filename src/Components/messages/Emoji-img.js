import { emojiMap } from "./assets/EmoticonMap";

const renderMessageContent = (content) => {
  // Split content by spaces
  const words = content.split(" ");
  
  return words.map((word, i) => {
    if (emojiMap[word]) {
      return (
        <img
          key={i}
          src={emojiMap[word]}
          alt={word}
          className="emoji-inline"
        />
      );
    }
    return word + " "; // keep normal text
  });
};

export default renderMessageContent;