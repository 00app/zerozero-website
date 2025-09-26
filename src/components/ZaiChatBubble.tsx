import React from 'react';

interface ZaiAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ZaiMessage {
  type: 'user' | 'zai';
  text?: string;
  label?: string;
  copy?: string;
  actions?: ZaiAction[];
}

interface ZaiChatBubbleProps {
  message: ZaiMessage;
}

export function ZaiChatBubble({ message }: ZaiChatBubbleProps) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <p className="text-[20px] font-bold text-white">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="w-full bg-white/5 rounded-[40px] p-5">
        <div className="space-y-4">
          {/* Zai Label */}
          {message.label && (
            <div className="text-[16px] font-bold text-white uppercase">
              {message.label}
            </div>
          )}

          {/* Zai Message Copy */}
          {message.copy && (
            <div className="text-[20px] font-bold text-white/90">
              {message.copy}
            </div>
          )}

          {/* Zai Actions */}
          {message.actions && message.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {message.actions.map((action, index) => (
                action.href ? (
                  <a
                    key={index}
                    href={action.href}
                    target="_blank"
                    rel="noopener nofollow sponsored"
                  >
                    <button className="bg-white text-black font-bold uppercase px-3 py-1.5 rounded-[50px] text-[14px] hover:bg-white/90 transition-colors">
                      {action.label}
                    </button>
                  </a>
                ) : (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="bg-white text-black font-bold uppercase px-3 py-1.5 rounded-[50px] text-[14px] hover:bg-white/90 transition-colors"
                  >
                    {action.label}
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}