import React, { useState } from "react";
import Picker from "emoji-picker-react";

export default function EmojiPicker(props) {
  const onEmojiClick = (event, emojiObject) => {
    if (props.node) {
      let start_pos = props.node.selectionStart;
      let prev_part =
        props.node.value.substring(0, props.node.selectionStart) +
        emojiObject.emoji;
      let after_part = props.node.value.substring(props.node.selectionStart);
      props.node.value = prev_part + after_part;
      props.node.selectionStart = start_pos + 2;
      props.node.selectionEnd = start_pos + 2;
      props.node.focus();
    }
  };

  return (
    <div>
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
}
