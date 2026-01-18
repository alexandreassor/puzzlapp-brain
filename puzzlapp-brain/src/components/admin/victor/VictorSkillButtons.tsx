import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Pen,
  Search,
  Download,
  LayoutList,
  BookOpen,
  MessageSquareWarning,
} from 'lucide-react';
import type { VictorSkill, VictorSkillConfig } from '@/types/victor';
import { VICTOR_SKILLS } from '@/types/victor';

// Map skill IDs to Lucide icons
const skillIcons: Record<VictorSkill, React.ElementType> = {
  redaction: Pen,
  recherche: Search,
  acquisition: Download,
  plan: LayoutList,
  bibliographie: BookOpen,
  critique: MessageSquareWarning,
};

interface VictorSkillButtonsProps {
  activeSkill: VictorSkill;
  onSkillChange: (skill: VictorSkill) => void;
  disabled?: boolean;
}

export function VictorSkillButtons({
  activeSkill,
  onSkillChange,
  disabled = false,
}: VictorSkillButtonsProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-2 p-3 border-b">
        {VICTOR_SKILLS.map((skill) => (
          <SkillButton
            key={skill.id}
            skill={skill}
            isActive={activeSkill === skill.id}
            onClick={() => onSkillChange(skill.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

interface SkillButtonProps {
  skill: VictorSkillConfig;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function SkillButton({ skill, isActive, onClick, disabled }: SkillButtonProps) {
  const Icon = skillIcons[skill.id];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center gap-1 h-auto py-2 px-2 transition-all',
            isActive && [skill.bgColor, 'border', `border-current`, skill.color],
            !isActive && 'hover:bg-muted'
          )}
        >
          <Icon className={cn('h-4 w-4', isActive ? skill.color : 'text-muted-foreground')} />
          <span className={cn(
            'text-xs font-medium truncate max-w-full',
            isActive ? skill.color : 'text-muted-foreground'
          )}>
            {skill.label}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="font-medium">{skill.label}</p>
        <p className="text-xs text-muted-foreground">{skill.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
