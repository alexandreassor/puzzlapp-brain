import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowDownToLine } from 'lucide-react';
import { useState } from 'react';
import type { VictorMessage as VictorMessageType } from '@/types/victor';
import { getSkillConfig } from '@/types/victor';

interface VictorMessageProps {
  message: VictorMessageType;
  onInsertToEditor?: (content: string) => void;
}

export function VictorMessage({ message, onInsertToEditor }: VictorMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const skillConfig = message.skill ? getSkillConfig(message.skill) : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertToEditor) {
      onInsertToEditor(message.content);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-lg',
        isUser ? 'bg-muted/50' : 'bg-background'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            'text-xs font-medium',
            isUser
              ? 'bg-primary text-primary-foreground'
              : skillConfig
                ? [skillConfig.bgColor, skillConfig.color]
                : 'bg-purple-500/10 text-purple-500'
          )}
        >
          {isUser ? 'A' : 'V'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? 'Alexandre' : 'Victor'}
          </span>
          {skillConfig && !isUser && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                skillConfig.bgColor,
                skillConfig.color
              )}
            >
              {skillConfig.label}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copier
                </>
              )}
            </Button>
            {onInsertToEditor && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleInsert}
              >
                <ArrowDownToLine className="h-3 w-3 mr-1" />
                Insérer
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
