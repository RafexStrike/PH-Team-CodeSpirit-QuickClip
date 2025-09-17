'use client';
export default function ChatInputBox({ value, onChange, onKeyPress, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className="textarea textarea-bordered w-full resize-none bg-base-100 border-base-300 focus:border-primary"
      rows="1"
      style={{ minHeight: '44px', maxHeight: '200px', overflow: 'auto' }}
    />
  );
}
